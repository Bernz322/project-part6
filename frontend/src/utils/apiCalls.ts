import axios, { AxiosRequestConfig } from "axios";
import {
  IUser,
  ILoginResponse,
  IMessage,
  IUploads,
  ISendMessage,
  IOneUpload,
  IUserUploads,
  ISharedUploads,
} from "../config/types";
import { getCookie, setCookie } from "./helpers";

/**
 * API Request wrapper which returns data directly from response (res.data)
 * @param {string} path
 * @param {object} config
 * @returns
 */
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

/**
 * Login API Request. If success, create a cookie with 24 hours duration storing Bearer token and set loggedUser id to local storage
 * @param {string} email
 * @param {string} password
 * @returns {ILoginResponse} ILoginResponse {name, email, id, token}
 */
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
  if (res) {
    setCookie({ cookieName: "accessToken", value: res.id, daysToExpire: 1 });
    localStorage.setItem("loggedUser", JSON.stringify(res.id));
  }
  return res;
};

/**
 * Register API Request. After a successful registration, redirect to register success page
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
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

/**
 * Fetch current logged in user by providing id inside local storage
 * @returns {IUser} IUser {name, email, id}
 */
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

export const editUserById = async (user: IUser): Promise<IUser> => {
  const res = await apiRequest<IUser>(`/users/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: user,
  });
  return res;
};

export const deleteUserById = async (id: string): Promise<IUser> => {
  const res = await apiRequest<IUser>(`/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

/**
 * Fetch all uploads of current logged in user
 * @returns {IUserUploads}
 */
export const fetchUserUploads = async (): Promise<IUserUploads[]> => {
  const id = JSON.parse(localStorage.getItem("loggedUser") || "");
  const res = await apiRequest<IUserUploads[]>(`/users/${id}/uploads`);
  return res;
};

/**
 * Fetch all uploads in the db
 * @returns {IUploads}
 */
export const fetchUploads = async (): Promise<IUploads[]> => {
  const res = await apiRequest<IUploads[]>(`/uploads`);
  return res;
};

/**
 * Fetch all uploads shared to the current logged in user
 * @returns {ISharedUploads}
 */
export const fetchSharedUploads = async (): Promise<ISharedUploads[]> => {
  const id = JSON.parse(localStorage.getItem("loggedUser") || "");
  const res = await apiRequest<ISharedUploads[]>(`/uploads/user/${id}`);
  return res;
};

export const fetchUploadById = async (id: string): Promise<IOneUpload> => {
  const res = await apiRequest<IOneUpload>(`/uploads/${id}`);
  return res;
};

export const addUpload = async (form: FormData): Promise<IOneUpload> => {
  const res = await apiRequest<IOneUpload>(`/uploads`, {
    method: "POST",
    data: form,
  });
  return res;
};

export const editUploadById = async (
  id: string,
  label: string
): Promise<{ id: string; label: string }> => {
  const res = await apiRequest<{ id: string; label: string }>(
    `/uploads/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: { label },
    }
  );
  return res;
};

export const deleteUploadById = async (id: string): Promise<void> => {
  const res = await apiRequest<void>(`/uploads/${id}`, {
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
  const res = await apiRequest<void>(`/uploads/${uploadId}/share/`, {
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
  const res = await apiRequest<void>(`/uploads/${uploadId}/unshare/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: { toRemoveId: userId },
  });
  return res;
};
