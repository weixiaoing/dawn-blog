const baseUrl = import.meta.env.VITE_API_URL;
export default function request<T>(
  url: string,
  body?: any,
  method = "post",
  init?: any
): Promise<{
  code: 0 | 1
  data: T
  message: string
}> {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  }
  if (body) config.body = JSON.stringify(body)
  return fetch(baseUrl.concat("/" + url), config).then((res) => res.json());
}

export function Get<T = any>(
  url: string,
  params?: { [key: string]: any },
  options?: any
): Promise<{
  code: 0 | 1
  data: T
  message: string
}> {
  if (!params) params = {};
  const query = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
  const completeUrl = query ? `${url}?${query}` : url;
  return fetch(`${baseUrl}/${completeUrl}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
    // ...options
  }).then((res) => res.json());
}

export function getWebData() {
  return request("admin/info", null, "get");
}