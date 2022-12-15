import { useContext } from "react"
import { AppContext } from "../@types"
import { appContext } from "../App"
import Message from "./Message"

const MessageArea = () => {
    const { selectedChat } = useContext<AppContext>(appContext);
    return (
        <div className="grow w-full pt-5">
            {/* <Message content="Hi" time="19:00" /> */}
            {
                selectedChat?.messages && selectedChat?.messages.map((message: any, i: number) => {
                    return <Message {...message} key={`Message-${selectedChat.id}-${i}`}/>
                })
            }
        </div>
    )
}

export default MessageArea