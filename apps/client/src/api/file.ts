import request, { Get } from "./request";

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

export async function checkFile(hash: string, name: string) {
  return Get("file/check", { hash, name });
}

export async function renameFile(_id: string, name: string) {
  return request("file/rename", { _id, name });
}