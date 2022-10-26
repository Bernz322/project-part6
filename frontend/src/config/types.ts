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
  id: string;
  token?: string;
}
export interface IUser {
  id: string;
  name: string;
  email: string;
}
export interface IMessage {
  id: string;
  senderId: string;
  message: string;
  time: string;
  user: ISender;
}

export interface ISendMessage {
  message: string;
  time: string;
  senderId: string;
}
export interface ISender {
  name: string;
  email?: string;
}
export interface IUploads {
  id: string;
  label: string;
  fileName: string;
  fileLocation: string;
  uploaderId: string;
  user: {
    name: string;
    email: string;
  };
}

export interface IOneUpload {
  id: string;
  label: string;
  fileName: string;
  fileLocation: string;
  sharedTo: string[];
  uploaderId: string;
  user: {
    name: string;
    email: string;
  };
  sharedToUsers: IUser[];
  availToShare: IUser[];
}
export interface IUserUploads {
  id: string;
  label: string;
  fileName: string;
  fileLocation: string;
  uploaderId: string;
  sharedTo: string[];
}

export interface ISharedUploads {
  id: string;
  label: string;
  fileName: string;
  fileLocation: string;
  uploaderId: string;
  user: {
    name: string;
    email: string;
  };
  sharedTo: string[];
}

export interface IResponse {
  error?: {
    message?: string;
  };
  meta: any;
  payload: any;
  type: string;
}
export interface ITableData {
  id: string;
  name?: string;
  email?: string;
  label?: string;
  fileName?: string;
  fileLocation?: string;
  file?: string;
  user?: {
    name: string;
    email: string;
  };
  uploaderId?: string;
  sharedTo?: string[];
}
export interface ITableProps {
  data: IUser[] | ISharedUploads[] | IUserUploads[];
  column: string[];
  tableName: string;
  loading?: boolean;
}

export interface IDeleteModalProps {
  show: boolean;
  onHide: () => void;
  data?: IModalPropsData;
  delete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IEditUploadModalProps {
  show: boolean;
  onHide: () => void;
  data?: IEditUploadModalPropsData;
  edit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setLabel: React.Dispatch<React.SetStateAction<IUploadDataEdit>>;
}
export interface IAddUploadModalProps {
  show: boolean;
  onHide: () => void;
  data?: IAddUploadModalPropsData;
  add: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setUploadData: React.Dispatch<React.SetStateAction<IUploadDataAdd>>;
}

export interface IModalPropsData {
  id: string;
  type: string;
}

export interface IEditUploadModalPropsData {
  uploadToEditData: IUploadDataEdit;
  type: string;
}
export interface IAddUploadModalPropsData {
  uploadToAddData: IUploadDataAdd;
  type: string;
}

export interface IUploadDataEdit {
  id: string;
  label: string;
}

export interface IUploadDataAdd {
  description: string;
  file: any;
}

export interface IEditUserData {
  meta: {
    arg: string;
    requestId: string;
    requestStatus: string;
  };
  payload: any;
  type: string;
}
