export interface IResponse {
  error?: {
    message?: string;
  };
  meta: any;
  payload: any;
  type: string;
}
