const ChatCard = () => {
    return (
        <div className="rounded hover:bg-gray-100 h-20 w-full flex items-center px-4 py-2 gap-2 cursor-pointer">
            <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex flex-col gap-2 grow self-start mt-4">
                <span className="bg-gray-200 h-2 rounded-lg w-16" />
                <span className="bg-gray-200 h-2 rounded-lg w-44" />
            </div>
        </div>
    )
}

export default ChatCard