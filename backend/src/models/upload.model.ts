import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Upload extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'string',
    required: true,
  })
  fileName: string;

  @property({
    type: 'string',
    required: true,
  })
  fileLocation: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  sharedTo: string[];

  @belongsTo(() => User, {name: 'user'})
  uploader_id: string;

  constructor(data?: Partial<Upload>) {
    super(data);
  }
}

export interface UploadRelations {
  // describe navigational properties here
}

export type UploadWithRelations = Upload & UploadRelations;