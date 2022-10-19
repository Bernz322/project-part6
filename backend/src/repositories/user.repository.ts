import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {User, UserRelations, Chat, Upload} from '../models';
import {ChatRepository} from './chat.repository';
import {UploadRepository} from './upload.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly messages: HasManyRepositoryFactory<Chat, typeof User.prototype.id>;

  public readonly uploads: HasManyRepositoryFactory<Upload, typeof User.prototype.id>;

  constructor(@inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('ChatRepository') protected chatRepositoryGetter: Getter<ChatRepository>, @repository.getter('UploadRepository') protected uploadRepositoryGetter: Getter<UploadRepository>,) {
    super(User, dataSource);
    this.uploads = this.createHasManyRepositoryFactoryFor('uploads', uploadRepositoryGetter,);
    this.registerInclusionResolver('uploads', this.uploads.inclusionResolver);
    this.messages = this.createHasManyRepositoryFactoryFor('messages', chatRepositoryGetter,);
    this.registerInclusionResolver('messages', this.messages.inclusionResolver);
  }
}
