import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Upload, User} from '../models';
import {UploadRepository} from '../repositories';

export class UploadUserController {
  constructor(
    @repository(UploadRepository)
    public uploadRepository: UploadRepository,
  ) {}

  @get('/uploads/{id}/user', {
    responses: {
      '200': {
        description:
          'Return the uploader information who created the particular upload by providing upload id.',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Upload.prototype.id,
  ): Promise<User> {
    return this.uploadRepository.user(id);
  }
}
