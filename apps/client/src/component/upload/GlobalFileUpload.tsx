import Worker from "@/utils/worker?worker";
import { Button } from "antd";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { mergeChunk, uploadChunk } from "../../api/imageUpload"

type Chunk = {
  formData: FormData;
  retries: number;
  status: "pending" | "success" | "fail" | "waiting";
  index: number;
  // [key: string]: any;
};

export class Uploader {
  private chunks: Chunk[] = [];
  private status: "uploading" | "completed" | "fail" | "paused" = "completed";
  private limit = 6;
  private finishedCount = 0;
  private hash = "";
  private name = "";
  private size = 4;
  readonly percentage = 0;
  private onProgress?: (info: string, percentage?: number) => void;
  constructor(options: {
    onProgress?: (info: string, percentage: number) => void;
  }) {
    this.onProgress = options?.onProgress;
  }
  private async getHash(file: File): Promise<string> {
    return new Promise((resolve) => {
      const worker = new Worker();
      worker.onmessage = (event) => {
        const { data } = event;
        this.onProgress?.("hash computing...", Math.round(data?.percentage));
        if (data?.hash) {
          resolve(data?.hash);
          worker.terminate();
        }
      };
      worker.postMessage(file);
    });
  }
  private createChunk(file: File, size = this.size) {
    console.log(file);
    const chunkSize = 1024 * 1024 * size;
    const name = file.name;
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
  async start() {
    console.log("start");
    console.log(this);
    const len = this.chunks.length;
    while (
      this.finishedCount < len &&
      this.limit > 0 &&
      this.status === "uploading"
    ) {
      console.log(this.finishedCount);

      this.limit--;
      const chunk = this.chunks.find((item) => item.status === "waiting");
      if (!chunk) continue;
      chunk.status = "pending";
      uploadChunk(chunk.formData)
        .then(async (res) => {
          chunk.status = "success";
          this.limit++;
          this.finishedCount++;
          this.start();
          this.onProgress?.(
            "uploading...",
            Math.round((this.finishedCount / len) * 100)
          );
          if (this.finishedCount == len) {
            mergeChunk({ hash: this.hash, name: this.name }).then((res) => {
              this.status = "completed";
              this.onProgress?.("upload success", 100);
            });
          }
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
    console.log("resume");
    this.status = "uploading";
    this.start();
  }
  getStatus() {
    return {
      status: this.status,
      chunks: this.chunks,
      progress: this.percentage,
    };
  }
  async upLoad(file: File) {
    this.name = file.name;
    this.hash = await this.getHash(file);
    this.onProgress("hash finished");
    this.status = "uploading";
    this.chunks = this.createChunk(file);
    // this.start();
  }
}

export default function GlobalFileUpload() {
  const uploaderRef = useRef<Uploader>();
  const [period, setPeriod] = useState<{
    info: string;
    percentage: number;
  }>();
  useEffect(() => {
    uploaderRef.current = new Uploader({
      onProgress: (info, percentage) => {
        setPeriod({
          info,
          percentage,
        });
      },
    });
  }, []);

  const fileInputHander: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const files = e.target.files;
      const file = files?.[0];
      if (!file || !uploaderRef.current) return;
      await uploaderRef.current.upLoad(file);
    },
    []
  );

  return (
    <div>
      <input name="file" multiple onChange={fileInputHander} type="file" />
      <div>{period?.info}</div>
      <div>{period?.percentage}</div>
      <div>
        <Button
          onClick={
            () => {
              console.log("start Button");
              uploaderRef.current?.resume();
            }
            // continueUpload
          }
        >
          开始
        </Button>
        <Button onClick={() => uploaderRef.current?.pause()}>暂停</Button>
      </div>
    </div>
  );
}
