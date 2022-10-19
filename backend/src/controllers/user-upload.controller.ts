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
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User, Upload} from '../models';
import {UserRepository} from '../repositories';

export class UserUploadController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/uploads', {
    responses: {
      '200': {
        description: 'Array of User has many Upload',
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

  @post('/users/{id}/uploads', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Upload)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {
            title: 'NewUploadInUser',
            exclude: ['id'],
            optional: ['uploader_id'],
          }),
        },
      },
    })
    upload: Omit<Upload, 'id'>,
  ): Promise<Upload> {
    return this.userRepository.uploads(id).create(upload);
  }

  @patch('/users/{id}/uploads', {
    responses: {
      '200': {
        description: 'User.Upload PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {partial: true}),
        },
      },
    })
    upload: Partial<Upload>,
    @param.query.object('where', getWhereSchemaFor(Upload))
    where?: Where<Upload>,
  ): Promise<Count> {
    return this.userRepository.uploads(id).patch(upload, where);
  }

  @del('/users/{id}/uploads', {
    responses: {
      '200': {
        description: 'User.Upload DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Upload))
    where?: Where<Upload>,
  ): Promise<Count> {
    return this.userRepository.uploads(id).delete(where);
  }
}
