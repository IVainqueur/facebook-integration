import { useContext } from "react";
import { AppContext } from "../@types";
import { appContext } from "../App";

const ChatAreaTitle = () => {
    const { selectedChat } = useContext<AppContext>(appContext);
    return (
        <div className="w-full border-b border-b-gray-300 h-[60px] flex items-center p-4 gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <h3 className="font-bold text-gray-500">{selectedChat.username}</h3>
        </div>
    )
}

export default ChatAreaTitle