"use client"
import Button from "@/_components/UI/button"
import Card from "@/_components/UI/card"
import { Checkbox, DatePicker, Form, Input, Select } from "antd"
import Modal from "@/_components/UI/modal"
import { createMetting, deleteMeeting, getMeetingList } from "@/utils"
import dayjs, { Dayjs } from "dayjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import FormItem from "antd/es/form/FormItem"
import {
  signInWithGitHub,
  signInWithGoole,
  useSession,
} from "@/utils/auth-client"

export interface meeting {
  _id: string
  title: string
  startTime: string
  duration: number
  status: string
}
export default function Video() {
  const { data: session } = useSession()
  const [meetings, setMeetings] = useState([])
  const tmpData = {
    title: "meeting tilte",
    startTime: "2023-01-01 00:00:00",
    endTime: "2023-01-25 00:00:00",
    hostId: "123456",
  }
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const enterMeeting = (id: string) => {
    router.push(`/video/${id}`)
  }
  const getList = async () => {
    getMeetingList({ page: 1, pageSize: 10, user: session?.user?.id }).then(
      (data) => {
        setMeetings(data)
      }
    )
  }

  useEffect(() => {
    getList()
  }, [session?.user?.id])

  if (!session?.user) {
    return (
      <div className="flex self-center w-full justify-center">
        <Card className="w-[400px]" border header="使用该功能需要用户登录...">
          <div className="flex justify-center pt-[100px] gap-4">
            <Button
              onClick={() => signInWithGitHub()}
              className="border rounded-full"
            >
              <FaGithub size={60} />
            </Button>
            <Button
              onClick={() => signInWithGoole()}
              className="border rounded-full"
            >
              <FcGoogle size={60} />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const SubmitForm = ({ onSubmit, hostName }) => {
    return (
      <Form
        onFinish={(v: {
          title: string
          startTime: Dayjs
          duration: number
        }) => {
          onSubmit({
            ...v,
            startTime: v.startTime.toDate(),
          })
        }}
      >
        <FormItem
          label="会议标题"
          initialValue={hostName + "的会议"}
          name="title"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </FormItem>
        <FormItem
          label="开始时间"
          name="startTime"
          initialValue={dayjs()}
          rules={[{ required: true }]}
        >
          <DatePicker minDate={dayjs()} className="w-full" showTime />
        </FormItem>
        <FormItem
          label="会议时长"
          name="duration"
          initialValue={60 * 30 * 1000}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={60 * 30 * 1000}>30分钟</Select.Option>
            <Select.Option value={60 * 60 * 1000}>1小时</Select.Option>
            <Select.Option value={60 * 60 * 2 * 1000}>2小时</Select.Option>
          </Select>
        </FormItem>
        <Button border className="w-full " type="submit">
          确定
        </Button>
      </Form>
    )
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Modal visible={open} onCancel={() => setOpen(false)}>
        <div className="mx-auto mt-40 border shadow-sm bg-white p-4 w-[400px] h-[500px]  ">
          <h1 className="text-[20px] font-bold">申请会议</h1>
          <SubmitForm
            hostName={session.user.name}
            onSubmit={(v) => {
              console.log(session)
              console.log(v)
              createMetting({
                ...v,
                hostId: session.user!.id,
              }).then((res) => {
                getList()
              })
              setOpen(false)
            }}
          ></SubmitForm>
        </div>
      </Modal>
      <Card className="w-[800px] bg-gray-400/10" border>
        <header className="flex flex-row-reverse">
          <Button
            border
            onClick={() => {
              setOpen(true)
              // createMetting(tmpData).then((res) => {
              //   getList()
              // })
            }}
          >
            申请会议
          </Button>
        </header>

        <ul className="w-full h-[600px] overflow-auto min-h-[600px] space-y-2">
          {!Array.isArray(meetings) || meetings.length === 0 ? (
            <li>暂无会议,点击上方去申请</li>
          ) : (
            meetings.map((item: meeting) => (
              <li
                className="rounded-xl flex bg-white p-2 relative"
                key={item._id}
              >
                <main className="flex-1">
                  {" "}
                  <p className="text-[12px] opacity-60">
                    {dayjs(item.startTime).format("M月D日")}
                  </p>
                  <h2 className="text-[20px]">{item.title}</h2>
                  <p>
                    {dayjs(item.startTime).format("HH:mm")}-
                    {dayjs(Date.parse(item.startTime) + item.duration).format(
                      "HH:mm"
                    )}
                  </p>
                </main>

                <div className=" space-x-4 pt-5">
                  <Button border onClick={() => enterMeeting(item._id)}>
                    加入会议
                  </Button>
                  <Button
                    border
                    onClick={() =>
                      deleteMeeting(item._id).then(() => {
                        getList()
                      })
                    }
                  >
                    取消会议
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  )
}
