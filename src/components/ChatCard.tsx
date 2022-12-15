import { MouseEventHandler, useContext } from "react";
import { AppContext } from "../@types";
import { appContext } from "../App";

interface ChatCardProps {
    skeleton?: boolean;
    username?: string;
    id?: string | null;
}

const ChatCard = ({ skeleton = false, username, id = null }: ChatCardProps) => {
    const { setSelectedChatId } = useContext<AppContext>(appContext);
    const onCardClick: MouseEventHandler = () => {
        if (!id) return;
        setSelectedChatId?.call(null, id, { id, username })
    }
    return (
        <div className="rounded hover:bg-gray-100 h-20 w-full flex items-center px-4 py-2 gap-2 cursor-pointer" title={id ?? ''} onClick={onCardClick}>
            {
                skeleton ?
                    <>
                        <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex flex-col gap-2 grow self-start mt-4">
                            <span className="bg-gray-200 h-2 rounded-lg w-16" />
                            <span className="bg-gray-200 h-2 rounded-lg w-44" />
                        </div>
                    </>
                    :
                    <>
                        <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex flex-col gap-2 grow self-start mt-4">
                            <span className="font-bold" >{username ?? '-- --'}</span>
                            {/* <span className="bg-gray-200 h-2 rounded-lg w-44" >{}</span> */}
                        </div>
                    </>
            }
        </div>
    )
}

export default ChatCard