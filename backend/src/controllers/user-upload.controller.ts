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
import {Upload} from '../models';
import {UserRepository} from '../repositories';

export class UserUploadController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
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
    // unlink file
    return this.userRepository.uploads(id).delete(where);
  }
}
