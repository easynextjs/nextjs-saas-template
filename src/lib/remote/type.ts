export type ApiResponse<T> = {
  data: T;
};

export type PaginatedResponse<T> = {
  result: T[];
  total: number;
  totalPages: number;
};
