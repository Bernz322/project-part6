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
  sender_id: string;
  message: string;
  time: string;
  user: ISender;
}

export interface ISendMessage {
  message: string;
  time: string;
  sender_id: string;
}
export interface ISender {
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

export interface ITableColumn {
  title: string;
}

export interface ITableData {
  id: string;
  name: string;
  email: string;
  label?: string;
  fileName?: string;
  file?: string;
}

export interface ITableProps {
  data: any; // have to be changed to IUser[] | IUploads[]
  column: ITableColumn[];
  tableName: string;
  loading?: boolean;
}

export interface IModalProps {
  show: boolean;
  onHide: () => void;
  data?: IRowData;
}

export interface IRowData {
  item: IUser; // have to be changed to IUser[] | IUploads[]
  type: string;
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
