import Message from "./Message"

const MessageArea = () => {
    return (
        <div className="grow w-full pt-5">
            <Message fromMe content="Hi" time="19:00" />
            <Message content="Hi" time="19:00" />
            <Message content="Hi" time="19:00" />
            <Message fromMe content="Hi" time="19:00" />
            <Message fromMe content="Hi" time="19:00" />
            <Message fromMe content="Hi" time="19:00" />
        </div>
    )
}

export default MessageArea