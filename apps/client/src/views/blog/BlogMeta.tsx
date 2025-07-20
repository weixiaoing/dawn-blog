import { DatePicker, Input, Select, SelectProps, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Post } from "../../api/post";

const tagsOptions: SelectProps["options"] = [{ value: "Note" }];

const statusOptions: SelectProps["options"] = [
  { value: "Invisible" },
  { value: "Draft" },
  { value: "Published" },
];

const optionRender = (option: any) => {
  const color = option.value.length > 5 ? "geekblue" : "green";
  return <Tag color={color}>{option.value}</Tag>;
};
export default function BlogMeta({
  data,
  className,
  onUpdate,
}: {
  data: Post;
  className?: string;
  onUpdate: (
    newData: Partial<
      Pick<typeof data, "status" | "updatedAt" | "summary" | "tags">
    >
  ) => void;
}) {
  const [cardData, setCardData] = useState<
    Pick<typeof data, "status" | "updatedAt" | "summary" | "tags">
  >({
    status: data.status,
    updatedAt: data.updatedAt,
    summary: data.summary,
    tags: data.tags,
  });
  useEffect(() => {
    setCardData({
      status: data.status,
      updatedAt: data.updatedAt,
      summary: data.summary,
      tags: data.tags,
    });
  }, [data]);

  const updatePost = (
    newData: Partial<
      Pick<typeof data, "status" | "updatedAt" | "summary" | "tags">
    >
  ) => {
    setCardData((v) => {
      const tmp = { ...v, ...newData };
      onUpdate(tmp);
      return tmp;
    });
  };
  return (
    <div className="Meta">
      <div className="col">
        <label htmlFor="status">{"status"}</label>
        <div className="value">
          <div style={{ height: "100%" }}>
            {" "}
            <Select
              placeholder="select one tag"
              value={cardData.status}
              onChange={(value) => {
                updatePost({ status: value });
              }}
              variant="borderless"
              style={{ width: "100%", height: "100%" }}
              optionRender={optionRender}
              options={statusOptions}
            />
          </div>
        </div>
      </div>
      <div className="col">
        <label htmlFor="date">{"date"}</label>
        <div className="value">
          <div style={{ height: "100%" }}>
            <DatePicker
              defaultValue={dayjs()}
              style={{ width: "100%" }}
              variant="borderless"
              onChange={(_, dateString: any) => {
                // updatePost({ updatedAt: dateString });
              }}
              value={dayjs(cardData?.updatedAt || dayjs())}
              suffixIcon=""
            />
          </div>
        </div>
      </div>
      <div className="col">
        <label htmlFor="summary">{"summary"}</label>
        <div className="value">
          <div style={{ height: "100%" }}>
            <Input.TextArea
              placeholder="EMPTY"
              defaultValue={"EMPTY"}
              value={cardData.summary}
              maxLength={200}
              variant="borderless"
              onChange={(e) => {
                setCardData((v: any) => {
                  return {
                    ...v,
                    summary: e.target.value,
                  };
                });
              }}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </div>
        </div>
      </div>
      <div className="col">
        <label htmlFor="tags">{"tags"}</label>
        <div className="value">
          <div style={{ height: "100%" }}>
            <Select
              mode="tags"
              placeholder="select your tags"
              value={cardData.tags}
              onChange={(value) => {
                setCardData({ ...cardData, tags: value });
              }}
              variant="borderless"
              style={{ width: "100%", height: "100%" }}
              optionRender={optionRender}
              tagRender={(tags) => {
                const color = tags.value?.length > 5 ? "geekblue" : "green";
                return <Tag color={color}>{tags.value}</Tag>;
              }}
              options={tagsOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
