import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
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
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {Upload} from '../models';
import {UploadRepository} from '../repositories';
import {FileUploadHandler} from '../types';

export class UploadController {
  constructor(
    @repository(UploadRepository)
    public uploadRepository: UploadRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
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
  ): Promise<any> {
    const uploadConfig = new Promise<object>((resolve, reject) => {
      return this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          return resolve(UploadController.getFilesAndFields(request));
        }
      });
    });

    const uploadData = await uploadConfig;
    this.uploadRepository.create(uploadData);
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
      uploader_id: request.body.uploader_id,
      sharedTo: [],
    };
    return toSave;
  };

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
    return this.uploadRepository.find(filter);
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
  ): Promise<Upload> {
    return this.uploadRepository.findById(id, filter);
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
  ): Promise<void> {
    await this.uploadRepository.updateById(id, upload);
  }

  @del('/uploads/{id}')
  @response(204, {
    description: 'Delete upload by ID',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.uploadRepository.deleteById(id);
  }

  // TODO Share/unshare, download, return all uploads shared to user
}
