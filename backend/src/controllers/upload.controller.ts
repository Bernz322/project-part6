import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Upload} from '../models';
import {UploadRepository} from '../repositories';

export class UploadController {
  constructor(
    @repository(UploadRepository)
    public uploadRepository : UploadRepository,
  ) {}

  @post('/uploads')
  @response(200, {
    description: 'Upload model instance',
    content: {'application/json': {schema: getModelSchemaRef(Upload)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {
            title: 'NewUpload',
            exclude: ['id'],
          }),
        },
      },
    })
    upload: Omit<Upload, 'id'>,
  ): Promise<Upload> {
    return this.uploadRepository.create(upload);
  }

  @get('/uploads/count')
  @response(200, {
    description: 'Upload model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Upload) where?: Where<Upload>,
  ): Promise<Count> {
    return this.uploadRepository.count(where);
  }

  @get('/uploads')
  @response(200, {
    description: 'Array of Upload model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Upload, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Upload) filter?: Filter<Upload>,
  ): Promise<Upload[]> {
    return this.uploadRepository.find(filter);
  }

  @patch('/uploads')
  @response(200, {
    description: 'Upload PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {partial: true}),
        },
      },
    })
    upload: Upload,
    @param.where(Upload) where?: Where<Upload>,
  ): Promise<Count> {
    return this.uploadRepository.updateAll(upload, where);
  }

  @get('/uploads/{id}')
  @response(200, {
    description: 'Upload model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Upload, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Upload, {exclude: 'where'}) filter?: FilterExcludingWhere<Upload>
  ): Promise<Upload> {
    return this.uploadRepository.findById(id, filter);
  }

  @patch('/uploads/{id}')
  @response(204, {
    description: 'Upload PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Upload, {partial: true}),
        },
      },
    })
    upload: Upload,
  ): Promise<void> {
    await this.uploadRepository.updateById(id, upload);
  }

  @put('/uploads/{id}')
  @response(204, {
    description: 'Upload PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() upload: Upload,
  ): Promise<void> {
    await this.uploadRepository.replaceById(id, upload);
  }

  @del('/uploads/{id}')
  @response(204, {
    description: 'Upload DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.uploadRepository.deleteById(id);
  }
}
