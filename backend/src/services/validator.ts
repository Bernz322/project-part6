import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';
import {CredentialsType} from '../types';

export function validateCredentials(credentials: CredentialsType) {
  // Validate Email
  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid email');
  }

  // Validate Password Length
  if (!credentials.password || credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'Password must be minimum 8 characters',
    );
  }
}
