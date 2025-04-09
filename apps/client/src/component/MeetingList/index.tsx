import { Calendar, CalendarProps } from "antd";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react"
import MeetingSchedule from "./MeetingSchedule"
import { getMeeting } from "../../api/meeting"

export default function MeetingList() {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {}

  return (
    <div className="p-2 border shadow-md flex h-[400px]">
      <Calendar
        className="w-[50%]"
        fullscreen={false}
        onPanelChange={onPanelChange}
      />
      <div className="border-l-2 p-2 w-[50%] h-full">
        <MeetingSchedule />
      </div>
      {/* <Timeline
        className="w-[400px] border-l-2 p-2"
        items={meetings}
      ></Timeline> */}
      {/* <div></div> */}
    </div>
  )
}
