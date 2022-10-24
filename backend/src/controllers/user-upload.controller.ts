import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {Upload} from '../models';
import {UploadRepository, UserRepository} from '../repositories';

export class UserUploadController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UploadRepository)
    public uploadRepository: UploadRepository,
  ) {}

  @get('/users/{id}/uploads', {
    responses: {
      '200': {
        description: 'Return all uploads of the user (provide id)',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Upload)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Upload>,
  ): Promise<Upload[]> {
    return this.userRepository.uploads(id).find(filter);
  }

  @del('/users/{id}/uploads', {
    responses: {
      '200': {
        description: 'Delete all user uploads (provide user id in the url)',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Upload))
    where?: Where<Upload>,
  ): Promise<Count> {
    const uploads = await this.uploadRepository.find(
      {
        where: {uploader_id: id},
      },
      {
        fields: ['fileLocation'],
      },
    );
    try {
      uploads.forEach(upload => {
        fs.unlinkSync(
          path.join(__dirname, `../../.sandbox/${upload.fileLocation}`),
        );
      });
      return this.userRepository.uploads(id).delete(where);
    } catch (err) {
      console.error(err);
      return {count: 0};
    }
  }
}
