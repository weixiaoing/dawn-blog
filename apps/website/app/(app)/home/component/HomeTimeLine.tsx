import RelativeTime from "@/_components/UI/common/RelativeTime";
import UnderLineLink from "@/_components/UI/UnderLineLink";
import { BlogData } from "@/_typs/blog";
import { Talk } from "@/_typs/talk";
import { getBlogList, getMeetingList, getTalksByPage } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import TimeLine from "../../../_components/UI/timeLine";
import { meeting } from "@/(app)/video/page";

export default function HomeTimeLine() {
  const [events, setEvents] = useState<BlogData[]>();
  const [meetings, setMettings] = useState<meeting[]>();
  useEffect(() => {
    getBlogList({ skip: 0, limit: 6 }).then((res) => {
      setEvents(res.data);
    });
  }, []);
  useEffect(() => {
    getMeetingList({ page: 1, pageSize: 6 }).then((res) => {
      setMettings(res);
    });
  }, []);

  return (
    <div className="flex flex-col xl:flex-row w-full justify-center max-w-[80vw] mx-auto px-8 [&>section]:flex-1">
      <section className="px-2">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl ml-2">最近更新的文章</h1>
          <main className="h-[200px] mt-10">
            {
              <TimeLine>
                {(!events || events.length == 0) && "暂无文章"}
                {events &&
                  events.map((event) => {
                    return (
                      <li
                        key={event._id}
                        className="flex min-w-0 justify-between"
                      >
                        <UnderLineLink
                          href={"/blog/" + event._id}
                          prefetch
                          className="min-w-0 shrink truncate"
                        >
                          {event.title}
                        </UnderLineLink>
                        <span className="ml-2 shrink-0 self-end text-xs opacity-70">
                          <RelativeTime date={event.date} />
                        </span>
                      </li>
                    );
                  })}
              </TimeLine>
            }
          </main>
          <Link
            role="button"
            className="flex justify-end opacity-65 text-sm hover:text-blue-400"
            href={"/blog"}
          >
            查看更多
          </Link>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl ml-2">最近会议</h1>
          <main className="h-[200px] mt-10">
            {
              <TimeLine>
                {(!meetings || meetings.length == 0) && "暂无会议"}
                {meetings &&
                  meetings.map((event) => {
                    return (
                      <li
                        key={event._id}
                        className="flex min-w-0 justify-between"
                      >
                        <UnderLineLink
                          href={"/video/" + event._id}
                          prefetch
                          className="min-w-0 shrink truncate"
                        >
                          {event.title}
                        </UnderLineLink>
                        <span className="ml-2 shrink-0 self-end text-xs opacity-70">
                          <RelativeTime date={event.startTime} />
                        </span>
                      </li>
                    );
                  })}
              </TimeLine>
            }
          </main>
          <Link
            role="button"
            className="flex justify-end opacity-65 text-sm hover:text-blue-400"
            href={"/video"}
          >
            查看更多
          </Link>
        </div>
      </section>
    </div>
  );
}
