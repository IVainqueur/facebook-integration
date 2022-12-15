import ChatAreaTitle from "./ChatAreaTitle"
import MessageArea from "./MessageArea"
import MessageBox from "./MessageBox"

const ChatArea = () => {
  return (
    <div className="grow flex flex-col">
        <ChatAreaTitle />
        <MessageArea />
        <MessageBox />
    </div>
  )
}

export default ChatArea