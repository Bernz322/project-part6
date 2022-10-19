import {Filter, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Chat} from '../models';
import {ChatRepository} from '../repositories';

export class ChatController {
  constructor(
    @repository(ChatRepository)
    public chatRepository: ChatRepository,
  ) {}

  @post('/chats')
  @response(200, {
    description: 'Chat model instance',
    content: {'application/json': {schema: getModelSchemaRef(Chat)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Chat, {
            title: 'NewChat',
            exclude: ['id'],
          }),
        },
      },
    })
    chat: Omit<Chat, 'id'>,
  ): Promise<Chat> {
    return this.chatRepository.create(chat);
  }

  @get('/chats')
  @response(200, {
    description: 'Array of Chat model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Chat, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Chat) filter?: Filter<Chat>): Promise<Chat[]> {
    return this.chatRepository.find({
      include: [
        {
          relation: 'user',
          scope: {
            fields: {id: false, password: false},
            // If we have another relation in here, we can do
            //  include: [{ relation: 'products' }],
          },
        },
      ],
    });
  }

  @del('/chats/{id}')
  @response(204, {
    description: 'Chat DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.chatRepository.deleteById(id);
  }
}
