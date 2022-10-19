import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Upload, UploadRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class UploadRepository extends DefaultCrudRepository<
  Upload,
  typeof Upload.prototype.id,
  UploadRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Upload.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Upload, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
