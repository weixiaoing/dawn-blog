import { ChangeEventHandler } from "react";
import SparkMD5 from "spark-md5";
import worker from "./worker/worker";
const FileUploader = () => {
  // const [files, setFiles] = useState<File[]>([]);
  // const [progressList, setProgressList] = useState({ val: [] });
  const getHash = (file) => {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = function (e) {
        const fileMd5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        resolve(fileMd5);
      };
    });
  };

  //  文件捆绑 切片过程放入worker线程会因为非transfer对象导致性能消耗 文件过大会导致内存溢出
  const getChunk = async (file: File, hash: any, size = 1) => {
    const name = file.name;
    // 文件分割
    const chunkFile = (file: File, size = 1) => {
      const chunkSize = 1024 * 1024 * size;
      const chunks: any[] = [];
      for (let i = 0; i < file.size; i += chunkSize) {
        chunks.push({
          file: file.slice(i, i + chunkSize),
          hash: hash,
          name: name,
          uploaded: false,
        });
      }
      return chunks;
    };
    const chunks = chunkFile(file, size);

    return chunks;
  };

  const uploadChunk = async (chunk) => {
    const formData = new FormData();
    formData.append("file", chunk.file);
    formData.append("hash", chunk.hash);
    formData.append("name", chunk.name);
    formData.append("uploaded", chunk.uploaded);
    formData.append("index", chunk.index);
    const res = await fetch("/file/upload", {
      method: "post",
      body: formData,
    }).then((res) => res.json());
    return res;
  };
  const uploadChunks = async (chunks, maxNum = 10) => {
    return new Promise((resolve, reject) => {
      if (chunks.length === 0) {
        return;
      }
      const requestSliceArr = [];
      let start = 0;
      while (start < chunks.length) {
        requestSliceArr.push(chunks.slice(start, start + maxNum));
        start += maxNum;
      }
      let index = 0;
      const requestReaults: any = [];
      const requestErrReaults = [];

      const request = async () => {
        if (index > requestSliceArr.length - 1) {
          resolve(requestReaults);
          return;
        }
        const sliceChunks = requestSliceArr[index];
        Promise.all(sliceChunks.map((chunk) => uploadChunk(chunk)))
          .then((res) => {
            requestReaults.push(...(Array.isArray(res) ? res : []));
            index++;
            request();
          })
          .catch((err) => {
            requestErrReaults.push(...(Array.isArray(err) ? err : []));
            reject(requestErrReaults);
          });
      };
      request();
    });
  };

  const handleFileInput: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    // 文件上传

    const file = event.target.files![0];
    if (!file) return;
    const name = file.name;
    const hash = await getHash(file);
    const chunks = await getChunk(file, hash);
    console.log("chunks", chunks);
    // const continueUpload = async (file) => {
    //   if (chunks.length == 0 || !hash || !file) {
    //     return;
    //   }
    //   try {
    //     await uploadChunks(chunks.filter((chunk) => !chunk.uploaded));
    //     await mergeRequest(hash, name);
    //   } catch (err) {
    //     return {
    //       mag: "文件上传错误",
    //       success: false,
    //     };
    //   }
    // };
    // try {
    //   let result = await uploadChunks(chunks, 10);
    //   console.log("result", result);
    //   result = await mergeRequest(hash, file.name);
    //   console.log("result", result);
    // } catch (err) {
    //   console.log("err", err);
    // }
  };
  // const mergeRequest = (fileHash: any, fileName: any) => {
  //   return fetch(
  //     `http://localhost:3000/merge?fileHash=${fileHash}&fileName=${fileName}`,
  //     {
  //       method: "GET",
  //     }
  //   ).then((res) => res.json());
  // };

  const fn = async () => {
    console.log("yes");

    worker.postMessage(10);
    worker.onmessage = (event) => {
      const { data } = event;
      console.log("worker", data);
      worker.terminate();
    };
  };

  return (
    <div onDrag={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
      <input
        type="file"
        id="fileUpLoad"
        style={{ display: "none" }}
        multiple
        onChange={() => {
          fn();
        }}
      />
      <label htmlFor="fileUpLoad">
        <span className="cursor-pointer border p-1">Upload</span>
      </label>
      {/* <section className="space-y-2">
        {" "}
        {files.map((file, index) => (
          <div
            className="flex justify-between border rounded p-1"
            key={file.lastModified}
          >
            {file.name}
            <button
              onClick={() => {
                console.log(file);
              }}
            >
              confirm
            </button>
          </div>
        ))}
      </section> */}
    </div>
  );
};

export default FileUploader;
