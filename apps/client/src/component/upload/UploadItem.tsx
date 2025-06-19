import { Button, Progress } from "antd";
import { useEffect, useRef, useState } from "react";
import { Uploader } from "../../utils/file";

const UploadItem = ({
  file,
  onfinish,
}: {
  file: File;
  onfinish: () => void;
}) => {
  const [percentace, setPercentage] = useState<number>(0);
  const [status, setStatus] = useState<
    "uploading" | "completed" | "fail" | "paused"
  >("uploading");
  const uploadRef = useRef<InstanceType<typeof Uploader>>();
  useEffect(() => {
    uploadRef.current = new Uploader(file, ({ percentage, status }) => {
      if (status === "completed") {
        onfinish()
      }
      setPercentage(percentage || 0)
    })
    uploadRef.current.start(file)
    return () => uploadRef.current?.pause()
  }, [file])
  return (
    <div className="upload-item py-2 space-y-2">
      <header>{file.name}</header>
      <Progress percent={percentace} />
      <footer className="flex gap-4">
        <Button onClick={() => uploadRef.current?.resume()}>开始</Button>
        <Button onClick={() => uploadRef.current?.pause()}>暂停</Button>
      </footer>
    </div>
  )
};
export default UploadItem;
