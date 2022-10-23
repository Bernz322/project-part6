import {RequestHandler} from 'express-serve-static-core';

export type CredentialsType = {
  email: string;
  password: string;
};

export type FileUploadHandler = RequestHandler;

interface ISharedToUsers {
  id: string;
  name: string;
  email: string;
}

export type UploadGetById = {
  sharedToUsers: ISharedToUsers[];
  id?: string | undefined;
  label: string;
  fileName: string;
  fileLocation: string;
  sharedTo?: string[] | undefined;
  uploader_id: string;
};
