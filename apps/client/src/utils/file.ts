import Worker from "@/utils/worker?worker";
import { mergeChunk, uploadChunk } from "../api/imageUpload";
import { checkFile } from "../api/file";
type Chunk = {
  formData: FormData;
  retries: number;
  status: "pending" | "success" | "fail" | "waiting";
  index: number;
  // [key: string]: any;
};
export class Uploader {
  private chunks: Chunk[] = [];
  status: "uploading" | "completed" | "fail" | "paused" = "completed";
  private limit = 6;
  finishedCount = 0;
  private hash = "";
  name = "";
  private size = 4;
  percentage = 0;
  private onChange: (uploader: Uploader) => void;
  constructor(file: File, onChange: (uploader: Uploader) => void) {
    this.name = file.name;
    this.onChange = onChange;
  }
  private async getHash(file: File): Promise<string> {
    return new Promise((resolve) => {
      const worker = new Worker();
      worker.onmessage = (event) => {
        const { data } = event;
        if (data?.hash) {
          resolve(data?.hash);
          worker.terminate();
        }
      };
      worker.postMessage(file);
    });
  }
  private createChunk(file: File, size = this.size) {
    const chunkSize = 1024 * 1024 * size;
    const chunks: Chunk[] = [];
    for (let i = 0, index = 0; i < file.size; i += chunkSize, index++) {
      const blob = file.slice(i, i + chunkSize);
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("hash", this.hash);
      formData.append("name", this.name);
      formData.append("type", "file");
      formData.append("index", index.toString());
      chunks.push({
        formData,
        retries: 0,
        status: "waiting",
        index: i,
      });
    }
    return chunks;
  }
  async upload() {
    const len = this.chunks.length;
    while (
      this.finishedCount < len &&
      this.limit > 0 &&
      this.status === "uploading"
    ) {
      this.limit--;
      const chunk = this.chunks.find((item) => item.status === "waiting");
      if (!chunk) continue;
      chunk.status = "pending";
      uploadChunk(chunk.formData)
        .then(async (res) => {
          chunk.status = "success";
          this.limit++;
          this.finishedCount++;
          this.upload();
          if (this.finishedCount >= len) {
            await mergeChunk({ hash: this.hash, name: this.name });
            this.status = "completed";
          }
          this.percentage = Math.round((this.finishedCount / len) * 100);
          this.onChange(this);
        })
        .catch((err) => {
          chunk.status = "waiting";
          this.limit++;
          chunk.retries++;
          if (chunk.retries >= 3) {
            // 出错时暂停
            this.status = "fail";
            this.finishedCount++;
          }
        });
    }
  }
  pause() {

    this.status = "paused";
  }
  resume() {

    this.status = "uploading";
    this.upload();
  }
  getStatus() {
    return {
      status: this.status,
      chunks: this.chunks,
      progress: this.percentage,
    };
  }
  async start(file: File) {
    this.status = "uploading";
    this.hash = await this.getHash(file);
    this.chunks = this.createChunk(file);
    const result = await checkFile(this.hash, this.name)
    if (result.data == true) {
      this.status = "completed";
      this.percentage = 100
      this.onChange(this);
      return
    }
    this.upload();
  }
}
