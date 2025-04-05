import axios from "axios";
import { ApiResponse } from "./type";

export function createApiClient(
  prefix: string,
  headers?: Record<string, string>
) {
  return {
    _auth: (headerValue: string) => {
      return createApiClient(prefix, {
        ...headers,
        Authorization: headerValue,
      });
    },
    bearerAuth: (token: string) => {
      return createApiClient(prefix, headers)._auth(`Bearer ${token}`);
    },
    get: async <Response = any>(path: string) => {
      const response = await axios.get<ApiResponse<Response>>(
        `${prefix}${path}`,
        {
          headers: headers,
        }
      );
      return response.data.data;
    },
    post: async <Response = any>(path: string, data: any = {}) => {
      const response = await axios.post<ApiResponse<Response>>(
        `${prefix}${path}`,
        data,
        {
          headers: headers,
        }
      );
      return response.data.data;
    },
    put: async <Response = any>(path: string, data: any) => {
      const response = await axios.put<ApiResponse<Response>>(
        `${prefix}${path}`,
        data,
        { headers: headers }
      );
      return response.data.data;
    },
    patch: async <Response = any>(path: string, data: any) => {
      const response = await axios.patch<ApiResponse<Response>>(
        `${prefix}${path}`,
        data,
        { headers: headers }
      );
      return response.data.data;
    },
    delete: async <Response = any>(path: string) => {
      const response = await axios.delete<ApiResponse<Response>>(
        `${prefix}${path}`,
        { headers: headers }
      );
      return response.data.data;
    },
  };
}
