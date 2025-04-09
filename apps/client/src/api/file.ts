import request from "./request";

const baseUrl = import.meta.env.VITE_API_URL;
export async function findFiles() {
  return fetch(baseUrl + `/file/getFiles`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export async function deleteFile(_id: string) {
  return request("file/delete", { _id }, "delete");
}
