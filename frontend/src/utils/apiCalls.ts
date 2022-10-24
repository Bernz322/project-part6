import axios, { AxiosRequestConfig } from "axios";
import {
  IUser,
  ILoginResponse,
  IMessage,
  IUpload,
  ISendMessage,
} from "../config/types";
import { getCookie, setCookie } from "./helpers";

const apiRequest = async <T>(
  path: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const token = getCookie("accessToken");
  const request = {
    url: `http://localhost:8888${path}`,
    ...config,
  };

  if (token) {
    if (!request.headers) request.headers = {};
    request.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios(request);
  let data: any = null;
  try {
    data = res.data;
  } catch (error) {}
  return data as T;
};

export const login = async (
  email: string,
  password: string
): Promise<ILoginResponse> => {
  const res = await apiRequest<ILoginResponse>(`/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { email, password },
  });
  console.log(res);
  if (res) {
    setCookie({ cookieName: "accessToken", value: res.id, daysToExpire: 1 });
    localStorage.setItem("loggedUser", JSON.stringify(res.id));
  }
  return res;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  await apiRequest(`/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { name, email, password },
  });
};

export const fetchLoggedInUser = async (): Promise<IUser> => {
  const id = JSON.parse(localStorage.getItem("loggedUser") || "");
  const res = await apiRequest<IUser>(`/users/${id}`);
  return res;
};

export const fetchMessages = async (): Promise<IMessage[]> => {
  const res = await apiRequest<IMessage[]>(`/chats`);
  return res;
};

export const sendMessage = async (msg: ISendMessage): Promise<IMessage> => {
  const res = await apiRequest<IMessage>(`/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: msg,
  });
  return res;
};

export const fetchUsers = async (): Promise<IUser[]> => {
  const res = await apiRequest<IUser[]>(`/users`);
  return res;
};

export const fetchUserById = async (id: string): Promise<IUser> => {
  const res = await apiRequest<IUser>(`/users/${id}`);
  return res;
};

export const editUserById = async (
  id: string,
  name: string,
  email: string
): Promise<void> => {
  const res = await apiRequest<void>(`/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: { name, email },
  });
  return res;
};

export const deleteUserById = async (id: string): Promise<void> => {
  const res = await apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const fetchUserUploads = async (): Promise<IUpload[]> => {
  const id = JSON.parse(localStorage.getItem("loggedUser") || "");
  const res = await apiRequest<IUpload[]>(`/uploads/${id}`);
  return res;
};

export const fetchUploads = async (): Promise<IUpload[]> => {
  const res = await apiRequest<IUpload[]>(`/uploads/`);
  return res;
};

export const fetchUploadById = async (id: string): Promise<IUpload[]> => {
  const res = await apiRequest<IUpload[]>(`/uploads/single/${id}`);
  return res;
};

export const addUpload = async (form: any): Promise<IUpload> => {
  const res = await apiRequest<IUpload>(`/uploads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: form,
  });
  return res;
};

export const editUploadById = async (
  id: string,
  label: string
): Promise<{ label: string }> => {
  const res = await apiRequest<{ label: string }>(
    `/uploads/single/edit/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: label,
    }
  );
  return res;
};

export const deleteUploadById = async (id: string): Promise<void> => {
  const res = await apiRequest<void>(`/uploads/single/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const shareUploadToUser = async (
  uploadId: string,
  userId: string
): Promise<void> => {
  const res = await apiRequest<void>(`/uploads/single/share/${uploadId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: { toShareId: userId },
  });

  return res;
};

export const unshareUploadToUser = async (
  uploadId: string,
  userId: string
): Promise<void> => {
  const res = await apiRequest<void>(`/uploads/single/remove/${uploadId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: { toRemoveId: userId },
  });
  return res;
};
