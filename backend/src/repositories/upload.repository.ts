import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Upload, UploadRelations} from '../models';

export class UploadRepository extends DefaultCrudRepository<
  Upload,
  typeof Upload.prototype.id,
  UploadRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Upload, dataSource);
  }
}
