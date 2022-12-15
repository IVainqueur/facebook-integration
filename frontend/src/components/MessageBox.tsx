// import { ChangeEventHandler, useState } from "react"

import { useContext } from "react"
import { AppContext } from "../@types"
import { appContext } from "../App"

const MessageBox = () => {
  const { sendMessage, selectedChat } = useContext<AppContext>(appContext)
  const onKeyUpHandler = (e: any) => {
    if (e.key === 'Enter' && !e.nativeEvent.shiftKey) {
      // console.log("[MessageBox] Sending Message", e.target.value)
      sendMessage?.call(null, e.target.value, { id: selectedChat.id, userId: selectedChat.userId })
    }
  }
  return (
    <div className="h-fit min-h-[80px] w-full border-t border-t-gray-300 flex items-center px-4 py-2 gap-2">
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      <textarea
        // type="text"
        placeholder="Aa"
        className="bg-gray-100 rounded-full w-3/4 py-4 px-8 outline-none min-h-[40px] h-[60px]"
        // value={message ?? undefined}
        // onChange={onChangeHandler}
        onKeyUp={onKeyUpHandler}
      />
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />

    </div>
  )
}

export default MessageBox