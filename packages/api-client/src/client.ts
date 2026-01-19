// using native RequestInit

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export type RequestConfig<TVariables = unknown> = {
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD';
  url: string;
  params?: unknown;
  data?: TVariables;
  responseType?: 'json' | 'blob' | 'text';
} & RequestInit;

export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers: Headers;
};

export type ResponseErrorConfig<TError = unknown> = ResponseConfig<TError>;

// Global configuration
let globalConfig: ApiClientConfig = {
  baseUrl: '',
};

export function createApiClient(config: ApiClientConfig) {
  globalConfig = { ...globalConfig, ...config };
}

export async function client<TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> {
  const { method, url, params, data, headers, ...rest } = config;

  const queryParams = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';

  const response = await fetch(`${globalConfig.baseUrl}${url}${queryParams}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...globalConfig.headers,
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...rest,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = {
      data: errorData as TError,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
    throw error;
  }

  const responseData = await response.json().catch(() => ({}));

  return {
    data: responseData as TData,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}

export default client;
