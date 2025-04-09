const token = import.meta.env.VITE_GITHUB_TOKEN;
const repo = import.meta.env.VITE_GITHUB_REPO; // 填你的仓库 repo;
const baseUrl = import.meta.env.VITE_API_URL;
export const imgToGitCloud = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const reader = new FileReader();
  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        console.log('test', event);

        const fileContent = event.target?.result as string;
        if (!fileContent) {
          reject(new Error("文件为空"));
        }
        resolve(fileContent!.split(",")[1]);
      };
      reader.readAsDataURL(file);
    });
  }
  const path = "img/" + new Date().valueOf() + "_" + file.name;

  const content = await getBase64(file);
  const url = "https://api.github.com/repos/" + repo + "/contents/" + path;
  console.log(content, url);

  const res = await fetch(url, {
    method: "put",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Upload image",
      content,
      branch: "main",
      path,
    }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.content.download_url;
  } else {
    console.log(res);
    console.log("文件格式错误");
  }
};

export const uploadChunk = async (formdata: FormData) => {
  const res = await fetch(baseUrl + "/file/upload", {
    method: "POST",
    body: formdata,
  });
  return res.json();
};

export const mergeChunk = async ({
  hash,
  name,
}: {
  hash: string;
  name: string;
}) => {
  const res = await fetch(
    baseUrl + `/file/merge?` + new URLSearchParams({ hash, name }),
    {
      method: "get",
    }
  );
  return res.json();
};
