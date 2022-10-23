import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  ReferencesManyAccessor,
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

  // RefMany
  // public readonly sharedTo: ReferencesManyAccessor<
  //   User,
  //   typeof Upload.prototype.id
  // >;
  // RefMany - end

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Upload, dataSource);
    // RefMany
    // this.sharedTo = this.createReferencesManyAccessorFor(
    //   'sharedTo',
    //   userRepositoryGetter,
    // );
    // this.registerInclusionResolver('sharedTo', this.sharedTo.inclusionResolver);
    // RefManyEnd
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
