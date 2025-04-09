import Card from "@/_components/UI/card";
import { BlogData } from "@/_typs/blog";
import dayjs from "dayjs";
import Link from "next/link";
import { AiFillEye, AiFillLike } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import removeMarkdown from "remove-markdown";
import PostModal from "./PostModal";
import "./index.css";
const PostItem = (data: BlogData) => {
  return (
    <div
      id="hover-box"
      className="pb-4 before:bg-[rgba(230,201,181,0.26)] before:dark:bg-[rgba(230,201,181,0.19)] "
    >
      <Card
        className="p-0 "
        header={
          <div className="space-y-2">
            <Link href={`/blog/${data._id}`}>
              <h1 className="text-xl dark:text-zinc-200  ">{data.title}</h1>
            </Link>
            <div className="flex gap-2">
              {data.tags.map((tag: string) => (
                <div
                  className="bg-[rgb(209,230,181)] p-1 rounded-md text-sm text-[#000000cc]"
                  key={tag}
                >
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        }
        describtion={
          <div >
            <PostModal content={data.content!} postId={data._id}>
              <p className="cursor-pointer leading-loose  line-clamp-4 text-sm text-gray-800/90 dark:text-gray-200/90">
                {/* {data.content!.length > 300

                  ? removeMarkdown(data.content!).slice(0, 300) + "..."
                  : removeMarkdown(data.content!)} */}
                {removeMarkdown(data.content!)}
              </p>
            </PostModal>
          </div>
        }
        footer={
          <div>
            <span className="text-gray-400 text-center text-sm flex gap-2 items-center ">
              <MdDateRange />
              {dayjs(data.date).locale("zh").format("YYYY年M月DD日")}
              <AiFillEye />
              {data.watched.toString()}
              <AiFillLike />
              {data.like.toString()}
            </span>
          </div>
        }
      ></Card>
    </div>
  );
};
export default PostItem;
