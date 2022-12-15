interface MessageProps {
    fromMe?: boolean;
    content: string;
    time: string;
}

const Message = ({fromMe = false, content, time}: MessageProps) => {
  return (
    <div className={`w-full  px-6 flex ${fromMe ? 'justify-end': 'justify-start'} mb-2`}>
        {/* <div className="bg-gray-200 rounded-full p-3 min-w-[150px] animate-pulse"/> */}
        <div className="max-w-[460px] bg-gray-200 rounded-3xl py-3 px-6 min-w-[150px]">{content}</div>
    </div>
  )
}

export default Message