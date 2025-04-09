const baseUrl = import.meta.env.VITE_API_URL;
export default function request(
  url: string,
  body?: any,
  method = "post",
  init?: any
) {
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


export function getWebData() {
  return request("admin/info", null, "get");
}