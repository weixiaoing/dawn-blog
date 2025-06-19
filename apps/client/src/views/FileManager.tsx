import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  TableProps,
  Upload,
} from "antd"
import clsx from "clsx"
import dayjs from "dayjs"
import { Key, useEffect, useMemo, useRef, useState } from "react"
import { deleteFile, findFiles, renameFile } from "../api/file"
import UploadItem from "../component/upload/UploadItem"
interface DataType {
  _id: string
  name: string
  type: string
  updatedAt: string
  path: string
}

const FileManager = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [data, setData] = useState<DataType[]>()
  const selected = useRef<DataType[]>()
  const [uploadTasks, setUploadTasks] = useState<File[]>()
  const [open, setOpen] = useState(false)
  const [renameShow, setRenameShow] = useState(false)
  const getFiles = async () => {
    const res = await findFiles()
    setData(res.data)
  }
  const [rename, setRename] = useState({
    _id: "",
    name: "",
  })

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      )
      selected.current = selectedRows
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  }
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "文件名",
        dataIndex: "name",
        render: (text: string, data) => {
          return (
            <a download href={data.path}>
              {text}
            </a>
          )
        },
      },
      {
        title: "类型",
        dataIndex: "type",
        render: (type: string) => <span>{type || "未知"}</span>,
      },
      {
        title: "修改日期",
        dataIndex: "updatedAt",
        render: (text: string) => (
          <span>{dayjs(text).format("YYYY-MM-DD")}</span>
        ),
      },
      {
        title: "",
        dataIndex: "",
        render: (text: string, item) => (
          <span className="flex gap-2">
            <Button
              onClick={() => {
                setRename({
                  _id: item._id,
                  name: item.name,
                })
                setRenameShow(true)
              }}
            >
              重命名
            </Button>
            <Button
              onClick={async () => {
                const res = await deleteFile(item._id)
                await getFiles()
                messageApi.success("删除成功")
              }}
            >
              删除
            </Button>
            <Button
              onClick={async () => {
                window.navigator.clipboard.writeText(item.path)
                messageApi.success("复制成功")
              }}
            >
              分享
            </Button>
          </span>
        ),
      },
    ],
    []
  )
  useEffect(() => {
    getFiles()
  }, [])
  return (
    <div>
      {contextHolder}
      <Modal
        title="重命名"
        open={renameShow}
        onOk={async () => {
          const res = await renameFile(rename._id, rename.name)
          if (res.code == 1) {
            await getFiles()
            messageApi.success("重命名成功")
            setRenameShow(false)
          }
        }}
        onClose={() => {
          setRenameShow(false)
        }}
        onCancel={() => {
          setRenameShow(false)
        }}
      >
        <Input
          value={rename.name}
          onChange={(e) => setRename({ ...rename, name: e.target.value })}
        ></Input>
      </Modal>
      <header className="flex gap-4">
        <Upload
          showUploadList={false}
          customRequest={(file) => {
            console.log(file)
            const item = file.file as File
            if (!item) return
            setUploadTasks((pre) => {
              return [item, ...(pre || [])]
            })
            setOpen(true)
          }}
        >
          <Button type="primary">上传</Button>
        </Upload>

        <Popconfirm
          title="删除文件"
          description="确认删除所有选中文件?"
          onConfirm={() => {
            console.log(selected.current?.map((item) => item._id))
            Promise.all(
              selected.current?.map((item) => {
                return deleteFile(item._id)
              }) || []
            )
              .then(getFiles)
              .then(() => message.success("删除成功"))
          }}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>删除</Button>
        </Popconfirm>

        <Button>新建文件夹</Button>
        <Button
          onClick={() => {
            setOpen(true)
          }}
        >
          上传列表
        </Button>
      </header>
      <section className="h-full mb-20 space-y-4 pt-4">
        <Table<DataType>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          columns={columns}
          dataSource={data || []}
          rowKey={(item) => item._id}
        />
      </section>
      <div
        className={clsx(
          "fixed rounded-md flex flex-col top-4 right-[10%] w-[700px] bg-white shadow-md border-black/5 border h-[400px] p-2 ",
          !open && "hidden"
        )}
      >
        <header className="h-[50px] flex justify-end p-2">
          <Button onClick={() => setOpen(false)}>关闭</Button>
        </header>
        {/* <GlobalFileUpload /> */}
        <div className="overflow-y-scroll flex-1">
          {uploadTasks?.map((task, index) => (
            <UploadItem key={task.name} file={task} onfinish={getFiles} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default FileManager
