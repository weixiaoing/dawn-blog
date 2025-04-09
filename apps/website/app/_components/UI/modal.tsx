// "use client";
import React, { Fragment } from "react"

type props = {
  display?: React.ReactNode
  visible: boolean
  children: React.ReactNode
  className?: string
  onClose?: () => void
  onOk?: () => void
  onCancel?: () => void
  open?: boolean
  border?: boolean
}
export default function Modal({
  children,
  onOk,
  onCancel,
  display,
  visible = false,
}: props) {
  return (
    <>
      {visible && (
        <div
          className="bg-gray-100/80  overscroll-contain  flex justify-center  fixed left-0 top-0  z-50  w-full h-full  overflow-y-scroll"
          onClick={(e) => {
            e.preventDefault()
            if (e.target === e.currentTarget) {
              onCancel?.()
            }
          }}
          onScroll={(e) => {
            e.preventDefault()
          }}
          onScrollCapture={(e) => {
            e.preventDefault()
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}
