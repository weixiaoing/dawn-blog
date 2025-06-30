import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./blog.css"
// import style manually
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  SelectProps,
  Tabs,
  Tag,
} from "antd"
import dayjs from "dayjs"
import "react-markdown-editor-lite/lib/index.css"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { findPost, updatePost } from "../../api/post"

import { Editor } from "@tiptap/react"
import { default as TipTapEditor } from "../../component/editor/Editor"
import ImgToGitupload from "../../component/upload/ImgToGitupload"
import { debounceWrapper } from "../../utils/common"
import CustomEditor from "../../component/editor/yoopta/YooptaEditor"
import useEditor from "../../component/editor/yoopta/useEditor"

const tagsOptions: SelectProps["options"] = [
  { value: "笔记" },
  { value: "思考" },
  { value: "工具" },
]

const statusOptions: SelectProps["options"] = [
  { value: "Invisible" },
  { value: "Draft" },
  { value: "Published" },
]

const optionRender = (option: any) => {
  const color = option.value.length > 5 ? "geekblue" : "green"
  return <Tag color={color}>{option.value}</Tag>
}

type articleType = {
  title: string
  type: string
  summary: string
  status: string
  date: Date
  cover: string
  tags: string[]
  content: string
}

const debouncedUpdatePost = debounceWrapper(updatePost)

export default function Blog() {
  const [messageApi, contextHolder] = message.useMessage()
  const { Id } = useParams()
  const { editor } = useEditor()
  const [loading, setLoading] = useState(false)
  const success = (content: string) => {
    messageApi.open({
      type: "success",
      content: content,
    })
  }

  const location = useLocation()
  const navigate = useNavigate()
  const preMd = location.state?.mdObject
  const [article, setArticle] = useState<articleType>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const getContent = async () => {
    const res = await findPost(Id!)
    setArticle(() => {
      let tmp = res.data[0]
      if (preMd)
        tmp = {
          ...tmp,
          ...preMd?.meta,
          content: preMd?.content,
        }
      return tmp
    })
    setLoading(false)
  }
  useEffect(() => {
    setLoading(true)
    getContent()
  }, [Id])
  const saveHandler = async (props?: Partial<articleType>) => {
    if (!Id) return
    return await updatePost(Id, {
      ...article,
      content: editor.getMarkdown(editor.getEditorValue()),
      ...props,
    })
  }
  const upLoadContent = useCallback(debouncedUpdatePost, [])
  const imgs = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => `/cover/default (${i + 1}).png`)
  }, [])

  const tabs = [
    {
      key: "1",
      label: "Local",
      children: (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignContent: "start",
              height: "200px",
              flexWrap: "wrap",
              overflowY: "auto",
              scrollBehavior: "auto",
            }}
          >
            {imgs.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setArticle((v) => {
                      const tmp = {
                        ...v!,
                        cover: item,
                      }
                      updatePost(Id!, tmp)
                      return tmp
                    })

                    handleCancel()
                  }}
                  style={{
                    width: "23%",
                    height: "80px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={item}
                    alt=""
                  />
                </div>
              )
            })}
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "Link",
      children: (
        <>
          <div style={{}}>
            <Form
              onFinish={(data) => {
                setArticle((v) => {
                  const tmp = {
                    ...v!,
                    cover: data.link,
                  }
                  console.log(data.link)

                  updatePost(Id!, tmp)
                  return tmp
                })
                handleCancel()
              }}
            >
              <Form.Item name="link">
                <Input placeholder="input link" />
              </Form.Item>
              <Form.Item>
                <div style={{ textAlign: "center" }}>
                  <Button
                    style={{ width: "50%" }}
                    size="large"
                    type="primary"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: "Upload",
      children: (
        <>
          <ImgToGitupload
            onFinish={(url: string) => {
              setArticle((article: any) => {
                const tmp = {
                  ...article,
                  cover: url,
                }
                updatePost(Id!, tmp)
                return tmp
              })
              handleCancel()
            }}
            onPreRender={(preUrl: string) => {
              setArticle((article: any) => {
                const tmp = {
                  ...article,
                  cover: preUrl,
                }
                return tmp
              })
              handleCancel()
            }}
          />
        </>
      ),
    },
  ]
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  if (!Id || loading || !article) return <div>loading</div>

  return (
    <div className="container max-w-4xl px-10">
      {contextHolder}
      <Card
        hoverable
        style={{ width: "100%" }}
        cover={
          <>
            <div>
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  right: "10px",
                  top: "10px",
                  gap: "4px",
                }}
              >
                <Button onClick={showModal}>Change cover</Button>
                <Modal
                  onCancel={handleCancel}
                  width={720}
                  footer
                  open={isModalOpen}
                >
                  <div>
                    <Tabs defaultActiveKey="1" items={tabs} />
                  </div>
                </Modal>
                <Button
                  onClick={async () => {
                    await saveHandler()
                    success("save success")
                    navigate(`/table`)
                  }}
                >
                  save
                </Button>
              </div>
            </div>
            <img
              style={{ width: "100%", objectFit: "cover", aspectRatio: "5/1" }}
              alt="error img link"
              src={article?.cover}
              onError={(e: any) => {
                // setTimeout(() => {
                e.target.src = "/cover/default (2).png"
                // }, 0);
              }}
            />
          </>
        }
      >
        <Input
          variant="borderless"
          placeholder="new title"
          style={{ fontSize: "24px", fontWeight: "bold" }}
          value={article?.title}
          onChange={(e) => {
            setArticle({ ...article, title: e.target.value })
          }}
          size="large"
        />
      </Card>
      <div className="Meta">
        <div className="col">
          <label htmlFor="status">{"status"}</label>
          <div className="value">
            <div style={{ height: "100%" }}>
              {" "}
              <Select
                placeholder="select one tag"
                value={article.status}
                onChange={(value) => {
                  setArticle({ ...article, status: value })
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
                  const res = new Date(dateString)
                  setArticle({ ...article, date: res })
                }}
                value={dayjs(article.date || dayjs())}
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
                value={article.summary}
                maxLength={200}
                variant="borderless"
                onChange={(e) => {
                  setArticle((v: any) => {
                    return {
                      ...v,
                      summary: e.target.value,
                    }
                  })
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
                value={article.tags.length > 0 ? article.tags : ["笔记"]}
                onChange={(value) => {
                  setArticle({ ...article, tags: value })
                }}
                variant="borderless"
                style={{ width: "100%", height: "100%" }}
                optionRender={optionRender}
                tagRender={(tags) => {
                  const color = tags.value?.length > 5 ? "geekblue" : "green"
                  return <Tag color={color}>{tags.value}</Tag>
                }}
                options={tagsOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <CustomEditor
        key={article.content}
        editor={editor}
        defaultValue={article.content}
        onChange={(content) => {
          upLoadContent(Id, { content })
        }}
      />
    </div>
  )
}
