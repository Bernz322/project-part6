export interface ISetCookie {
  cookieName: string;
  value: string;
  daysToExpire: number;
}
export interface IDeleteCookie {
  cookieName: string;
  path: string;
  domain: string;
}
export interface ILoginResponse {
  email: string;
  name: string;
  _id: string;
  token: string;
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
}
export interface IMessage {
  _id: string;
  user_id: string;
  message: string;
  time: string;
  sender: ISender[];
}
export interface ISender {
  _id: string;
  name: string;
  email?: string;
}
export interface IUpload {
  _id: string;
  file: string;
  file_name: string;
  label: string;
  sharedTo?: ISender[];
  uploader?: ISender[];
}

export interface IResponse {
  error?: {
    message?: string;
  };
  meta: any;
  payload: any;
  type: string;
}
