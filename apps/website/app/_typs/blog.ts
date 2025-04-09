export interface BlogData {
  _id: string;
  title: string;
  tags: string[];
  summary: string;
  status: string;
  watched: Number;
  like: Number;
  password?: string;
  date: string;
  cover: string;
  content?: string;
}

export interface Result<T> {
  code: number;
  msg: string;
  data: T;
  page?: number;
  pageSize?: number;
  total?: number;
}
