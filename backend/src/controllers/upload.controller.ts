import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  Request,
  RestBindings,
  Response,
  oas,
  HttpErrors,
} from '@loopback/rest';
import path from 'path';
import _ from 'lodash';
import fs from 'fs';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from '../keys';
import {Upload} from '../models';
import {UploadRepository, UserRepository} from '../repositories';
import {FileUploadHandler, UploadGetById} from '../types';

export class UploadController {
  constructor(
    @repository(UploadRepository)
    public uploadRepository: UploadRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {}

  @post('/uploads')
  @response(200, {
    description: 'Create new upload',
    content: {'application/json': {schema: getModelSchemaRef(Upload)}},
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Upload> {
    const uploadConfig = new Promise<object>((resolve, reject) => {
      return this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          return resolve(UploadController.getFilesAndFields(request));
        }
      });
    });

    const uploadToCreate = await uploadConfig;
    return await this.uploadRepository.create(uploadToCreate);
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  public static getFilesAndFields = (request: Request) => {
    const uploadedFiles: any = request.files;
    const toSave = {
      label: request.body.label,
      fileName: request.body.fileName,
      fileLocation: uploadedFiles[0].filename,
      uploaderId: request.body.uploaderId,
      sharedTo: [],
    };
    return toSave;
  };

  @get('/download/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    const index = fileName.lastIndexOf('-'); // file-name.exe-123456789, get index of the last "-"
    const renamedFile = fileName.slice(0, index); // file-name.exe, return the string before "-"
    response.download(file, renamedFile); // when downloading the file, return the "renamedFile" as its file name to make it look original
    return response;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }

  @get('/uploads')
  @response(200, {
    description: 'Return array of all uploads',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Upload, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Upload) filter?: Filter<Upload>): Promise<Upload[]> {
    return this.uploadRepository.find(
      {
        include: [
          {
            relation: 'user',
            scope: {
              fields: {id: false, password: false},
            },
          },
        ],
      },
      {fields: {sharedTo: false}},
    );
  }

  @get('/uploads/{id}')
  @response(200, {
    description: 'Return upload by ID',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Upload, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Upload, {exclude: 'where'})
    filter?: FilterExcludingWhere<Upload>,
  ): Promise<UploadGetById> {
    const uploadData: Upload = await this.uploadRepository.findById(id, {
      include: [
        {
          relation: 'user',
          scope: {
            fields: {id: false, password: false},
          },
        },
      ],
    });

    const usersArray = await this.userRepository.find({
      fields: {password: false},
    });

    const sharedIdArray = uploadData.sharedTo;
    const uploader = _.toString(uploadData.uploaderId);
    const sharedToUsers = usersArray.filter(user =>
      sharedIdArray.includes(user.id),
    );

    const notSharedToUsers = usersArray.filter(user => {
      return (
        sharedIdArray.filter(userSharedTo => {
          return userSharedTo === user.id;
        }).length === 0
      );
    });

    let availToShare = notSharedToUsers.filter(user => {
      return _.toString(user.id) !== uploader;
    });

    const toReturn = {...uploadData, sharedToUsers, availToShare};
    return toReturn;
  }

  @get('/uploads/user/{id}')
  @response(200, {
    description: 'Return array of all shared uploads to user by ID',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Upload, {includeRelations: true}),
        },
      },
    },
  })
  async findByUserId(
    @param.path.string('id') id: string,
    @param.filter(Upload, {exclude: 'where'})
    filter?: FilterExcludingWhere<Upload>,
  ): Promise<Upload[]> {
    const allUploads = await this.uploadRepository.find({
      include: [
        {
          relation: 'user',
          scope: {
            fields: {id: false, password: false},
          },
        },
      ],
    });
    const user = await this.userRepository.findById(id, {
      fields: {password: false},
    });

    let uploadsSharedToUser = allUploads.filter(upload => {
      return upload.sharedTo.find(item => item === user.id);
    });
    return uploadsSharedToUser;
  }

  @patch('/uploads/{id}')
  @response(204, {
    description: 'Update upload by ID',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {partial: true}),
        },
      },
    })
    upload: Upload,
  ): Promise<{id: string; label: string}> {
    await this.uploadRepository.updateById(id, upload);
    const uploadData: Upload = await this.uploadRepository.findById(id);
    return {id: uploadData.id as string, label: uploadData.label};
  }

  @patch('/uploads/{id}/share')
  @response(204, {
    description: 'Share upload to a user',
  })
  async shareUpload(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {partial: true}),
        },
      },
    })
    upload: Upload,
  ): Promise<void> {
    const uploadData: Upload = await this.uploadRepository.findById(id);
    const userId = upload.sharedTo[0];
    const sharedTo = uploadData.sharedTo;
    sharedTo?.splice(0, 0, userId);
    const data = {
      sharedTo,
    };

    await this.uploadRepository.updateById(id, data);
  }

  @patch('/uploads/{id}/unshare')
  @response(204, {
    description: 'Unshare upload to a user',
  })
  async unShareUpload(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {partial: true}),
        },
      },
    })
    upload: Upload,
  ): Promise<void> {
    const uploadData: Upload = await this.uploadRepository.findById(id);
    const userId = upload.sharedTo[0];
    const newSharedTo = uploadData.sharedTo?.filter(id => {
      return id !== userId;
    });
    const data = {
      sharedTo: newSharedTo,
    };
    await this.uploadRepository.updateById(id, data);
  }

  @del('/uploads/{id}')
  @response(204, {
    description: 'Delete upload by ID',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const uploadData: Upload = await this.uploadRepository.findById(id, {
      fields: ['fileLocation'],
    });
    try {
      fs.unlinkSync(
        path.join(__dirname, `../../.sandbox/${uploadData.fileLocation}`),
      );
      await this.uploadRepository.deleteById(id);
    } catch (err) {
      console.log(err);
    }
  }
}
