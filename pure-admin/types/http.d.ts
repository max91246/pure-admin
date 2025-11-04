type ResponseData<T> = {
  code: number;
  msg: string;
  data: T;
};

type PageDTO<T> = {
  total: number;
  rows: Array<T>;
};

interface BasePageQuery extends BaseQuery {
  page_index?: number;
  page_size?: number;
}

interface BaseQuery {
  begin_time?: string;
  end_time?: string;
  order_column?: string;
  order_direction?: string;
  time_range_column?: string;
}