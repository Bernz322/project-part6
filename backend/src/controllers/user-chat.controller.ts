import {Count, CountSchema, repository, Where} from '@loopback/repository';
import {del, getWhereSchemaFor, param} from '@loopback/rest';
import {Chat} from '../models';
import {UserRepository} from '../repositories';

export class UserChatController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @del('/users/{id}/chats', {
    responses: {
      '200': {
        description: 'Delete all user chats (provide user id in the url)',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Chat)) where?: Where<Chat>,
  ): Promise<Count> {
    return this.userRepository.messages(id).delete(where);
  }
}
