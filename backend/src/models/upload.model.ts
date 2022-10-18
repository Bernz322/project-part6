import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
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
  file: string;

  @property({
    type: 'string',
    required: true,
  })
  uploader: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  sharedTo: string[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Upload>) {
    super(data);
  }
}

export interface UploadRelations {
  // describe navigational properties here
}

export type UploadWithRelations = Upload & UploadRelations;
