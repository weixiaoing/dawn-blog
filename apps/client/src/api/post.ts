import request from "./request";

export async function findPost(id: string) {
  return request(`post/findPost`, { _id: id });
}

export async function updatePost(_id: string, data: any) {
  return request(`post/update`, { _id, config: data });
}

export function deletePostAPI(_id: string) {
  return request(`post/delete`, { _id }, "delete");
}
export async function createPostAPI() {
  return request(`post/create`);
}

export const getList = async () => {
  return request("post/findPostMeta").then((res) => {
    return res.data;
  });
};
