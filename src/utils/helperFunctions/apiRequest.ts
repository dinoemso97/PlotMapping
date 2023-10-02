// import axios, { AxiosRequestConfig } from "axios";
// import { Platform } from "react-native";
// //import { API_URL } from '@utils/constants'
// /**
//  * @description Base function for making any API calls.
//  * baseURL and accessToken are optional based on the circumstance.
//  * @author Haris Handzic
//  * @author Tarik Dervisevic
//  */

// export default async (
//   request: AxiosRequestConfig,
//   config: {
//     baseURL?: string;
//     params?: any;
//     body?: any;
//     contentType?: any;
//   } = {}
// ) => {
//   const { baseURL, params, body, contentType } = config;
//   request.method = request.method || "get";
//   request.withCredentials = true;
//   const URL = baseURL ? baseURL : API_URL;
//   // If request.url is specified, append it to the baseURL, otherwise just use the baseURL
//   request.url ? (request.url = `${URL}/${request.url}`) : (request.url = URL);
//   if (Platform.OS === "android") {
//     request.data = request.data || {};
//   }
//   if (request.data && request.method === "get") {
//     // If data is set the get request won't be made
//     request.data = null;
//   }
//   request.headers = {
//     ...request.headers,
//     "Content-Type": contentType ? contentType : "application/json",
//     "X-Device": "mobile",
//   };

//   if (params) {
//     request.params = params;
//   }

//   if (body) {
//     request.data = body;
//   }

//   return axios(request);
// };
