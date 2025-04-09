"use client";
import { useChat } from "ai/react";
import clsx from "clsx";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiFillRobot, AiOutlineUser } from "react-icons/ai";
import Modal from "../UI/modal";

export default function AiModal() {
  const [visible, setVisible] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/ai/streamChat",
    });
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {createPortal(
        <Modal onCancel={() => setVisible(false)} visible={visible}>
          <div className=" bg-white w-[50vw]  border p-2 shadow-xl">
            <ul className=" overflow-auto space-y-4 py-2 h-[400px]">
              {messages.map((m) => (
                <>
                  <li
                    key={m.id}
                    onClick={() => console.log(messages)}
                    className={clsx("whitespace-pre-wrap flex gap-2", {
                      "flex-row-reverse": m.role === "user",
                    })}
                  >
                    <div>
                      {m.role === "user" ? <AiOutlineUser /> : <AiFillRobot />}
                    </div>
                    <div className="bg-blue-400/30 p-2 rounded max-w-md">
                      {m.content}
                      <div>
                        {/* {m?.experimental_attachments
                          ?.filter((attachment) =>
                            attachment?.contentType?.startsWith("image/")
                          )
                          .map((attachment, index) => (
                            <Image
                              key={`${m.id}-${index}`}
                              src={attachment.url}
                              width={500}
                              height={500}
                              alt={attachment.name ?? `attachment-${index}`}
                            />
                          ))} */}
                      </div>
                    </div>
                  </li>
                </>
              ))}
              {/* {isLoading && <div>loading...</div>} */}
            </ul>

            <form
              onSubmit={(event) => {
                handleSubmit(event, {
                  experimental_attachments: files,
                });

                setFiles(undefined);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              {/* <input
                type="file"
                className=""
                onChange={(event) => {
                  if (event.target.files) {
                    setFiles(event.target.files);
                  }
                }}
                multiple
                ref={fileInputRef}
              /> */}
              <input
                className=" w-full p-2   border border-gray-300 rounded shadow-xl"
                value={input}
                placeholder="Say something..."
                onChange={handleInputChange}
              />
            </form>
          </div>
        </Modal>,
        document.body
      )}

      <div
        onClick={() => setVisible(true)}
        className="size-10 cursor-pointer flex items-center justify-center  rounded-full "
      >
        ai
      </div>
    </div>
  );
}
