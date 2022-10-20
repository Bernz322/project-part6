import {Filter, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
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
    description: 'Create new chat message',
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
    description: 'Return array of all chats',
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
}
