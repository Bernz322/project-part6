import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Chat, ChatRelations} from '../models';

export class ChatRepository extends DefaultCrudRepository<
  Chat,
  typeof Chat.prototype.id,
  ChatRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Chat, dataSource);
  }
}
