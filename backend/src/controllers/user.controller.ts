import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  HttpErrors,
  del,
  requestBody,
  response,
  patch,
  SchemaObject,
} from '@loopback/rest';
import {genSalt, hash, compare} from 'bcryptjs';
import _ from 'lodash';
import {validateCredentials} from '../services/';
import {User} from '../models';
import {UserRepository} from '../repositories';

export type CredentialsType = {
  email: string;
  password: string;
};

export type LoginReturnType = {
  id: string;
  email: string;
  name: string;
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/register')
  @response(200, {
    description: 'Create/ register a  new user',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    // Ensure a valid email value and password value
    validateCredentials(_.pick(user, ['email', 'password']));
    // Hash password and create the user object to be saved
    const password = await hash(user.password, await genSalt());
    const newUser = {
      name: user.name,
      email: user.email,
      password,
    };
    try {
      return await this.userRepository.create(newUser);
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @post('/login')
  async login(
    @requestBody(CredentialsRequestBody) credentials: CredentialsType,
  ): Promise<{}> {
    const {email} = credentials;
    validateCredentials(_.pick(credentials, ['email', 'password']));

    const foundUser = await this.userRepository.findOne({
      where: {email},
    });
    if (!foundUser) throw new HttpErrors[404]("User doesn't exist");

    const isMatch = await compare(credentials.password, foundUser.password);
    if (!isMatch) throw new HttpErrors.Unauthorized('Invalid credentials');
    const {password, ...user} = foundUser;
    return user;
  }

  @get('/users')
  @response(200, {
    description: 'Return array of all users',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(
      {include: ['messages', 'uploads']},
      {fields: {password: false}},
    );
  }

  // @authenticate('jwt')
  @get('/users/{id}')
  @response(200, {
    description: 'Return user by ID',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(
      id,
      {include: ['messages', 'uploads']},
      {fields: {password: false}},
    );
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Update user by ID',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    try {
      return await this.userRepository.updateById(id, user);
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @del('/users/{id}')
  @response(204, {
    description: 'Delete user by ID',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
