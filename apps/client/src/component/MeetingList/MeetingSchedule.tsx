import { Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react"
import { deleteMeeting, getMeeting } from "../../api/meeting"

export default function MeetingSchedule() {
  const [meetings, setMeetings] = useState([])
  useEffect(() => {
    getMeeting().then((res) => {
      const data = res.data.data
      setMeetings(data)
      console.log(data)
    })
  }, [])
  const deleteMeet = async (id) => {
    const res = await deleteMeeting(id)
    if (res.code != 1) return
    setMeetings((v) => v.filter((item) => item._id !== id))
  }
  return (
    <div className="h-full flex flex-col  ">
      {/* <h2>{dayjs().format("M月D日")}</h2>
      <section className="flex items-center justify-between">
        <span>{dayjs().format("dddd")}</span>
        <Button>全部会议</Button>
      </section> */}
      <ul className="overflow-auto ">
        {meetings.map((item) => {
          return (
            <li
              key={item._id}
              className="rounded-md  p-2 cursor-pointer flex items-center   hover:bg-gray-500/10 "
            >
              <div className="flex-1">
                <h3>{item.title}</h3>
                <h4>{dayjs(item.startTime).format("M月D日")}</h4>
                <span className="text-gray-400  text-sm">
                  {dayjs(item.startTime).format("HH:mm")}-
                  {dayjs(
                    new Date(item.startTime).valueOf() + item.duration
                  ).format("HH:mm")}
                </span>
              </div>
              <div className="w-[100px] space-y-2">
                <Button
                  onClick={() => {
                    window.location.href = `http://localhost:3000//video/${item._id}`
                  }}
                >
                  加入会议
                </Button>
                <Button onClick={() => deleteMeet(item._id)}>取消会议</Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
