import {RequestHandler} from 'express-serve-static-core';

export type CredentialsType = {
  email: string;
  password: string;
};

export type FileUploadHandler = RequestHandler;
