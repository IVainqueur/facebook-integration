import { useContext } from "react"
import { AppContext } from "../@types"
import { appContext } from "../App"
import ChatAreaTitle from "./ChatAreaTitle"
import MessageArea from "./MessageArea"
import MessageBox from "./MessageBox"

const ChatArea = () => {
  const { selectedChat } = useContext<AppContext>(appContext)
  return (
    <div className="grow flex flex-col">
      {
        !!selectedChat ?
          <>
            <ChatAreaTitle />
            <MessageArea />
            <MessageBox />
          </>
          :
          <>
            <div className="grid grow place-content-center text-gray-400">Easily communicate with your customers using sm-converse</div>
          </>
      }
    </div>
  )
}

export default ChatArea