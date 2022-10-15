import { IDeleteCookie, ISetCookie } from "../config/types";

/**
 * Adds extra rows in every table if the number of data passed to it contains less than 5 items.
 * Extra rows will only appear if the count of data is less than 5
 * @param {Array} data
 * @returns {Array}
 */
export const tablePopulate = (data: any[]): any[] => {
  let len = data?.length;
  let size;
  size =
    len === 0
      ? (size = 5)
      : len === 1
      ? (size = 4)
      : len === 2
      ? (size = 3)
      : len === 3
      ? (size = 2)
      : len === 4
      ? (size = 1)
      : (size = 1);
  let filteredData = [];

  for (let i = 0; i < len + size; i++) {
    filteredData.push(data[i]);
  }

  return filteredData;
};

/**
 * Validates email address
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email: string): boolean => {
  let atPosition = email.indexOf("@");
  let dotPosition = email.lastIndexOf(".");

  if (atPosition < 1 || dotPosition - atPosition < 2) {
    return true;
  }
  return false;
};

/**
 * Get cookie in the browser
 * @param {string} name
 * @returns {boolean | string}
 */
export const getCookie = (name: string): boolean | string => {
  let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  } else {
    return false;
  }
};

/**
 * Sets cookie in the browser after login
 * @param {string} cookieName
 * @param {string} value
 * @param {number} daysToExpire
 * @returns {void}
 */
export const setCookie = ({
  cookieName,
  value,
  daysToExpire,
}: ISetCookie): void => {
  const toStore = value;
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToExpire);
  document.cookie =
    cookieName +
    "=" +
    toStore +
    (daysToExpire == null ? "" : ";expires = " + currentDate.toUTCString()) +
    "; path=/";
};

/**
 * Deletes cookie in the browser after logout
 * @param {string} cookieName
 * @param {string} path
 * @param {string} domain
 * @returns {void}
 */
export const deleteCookie = ({
  cookieName,
  path,
  domain,
}: IDeleteCookie): void => {
  if (getCookie(cookieName)) {
    document.cookie =
      cookieName +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};

/**
 * Checks if a user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = (): boolean => {
  return Boolean(
    localStorage.getItem("loggedUser") && getCookie("accessToken")
  );
};

/**
 * Formats current date before it is passed to the API request specifically for sending message
 * @returns {string}
 */
export const getMessageDate = (): string => {
  let date, time, year;
  date = new Date(); // Get current date
  date = date.toLocaleString().split(" "); // Split it and turn it to array; ['9/9/2022,', '8:02:37', 'PM']
  time = date[1];
  date = date[0].split("/"); // To turn "/" to "-", we have to split them again; ['9', '9', '2022,']
  year = date[2].split(",");
  return (date = year[0] + "-" + date[1] + "-" + date[0] + " " + time); // 2022-9-9 9:49:25
};
