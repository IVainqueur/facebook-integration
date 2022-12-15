interface MessageProps {
    fromMe?: boolean;
    content: string;
    time: string;
}

const Message = ({fromMe = false, content, time}: MessageProps) => {
  return (
    <div className={`w-full px-6 flex ${fromMe ? 'justify-end': 'justify-start'} mb-2`}>
        <div className="bg-gray-200 rounded-full p-3 min-w-[150px] animate-pulse"/>
    </div>
  )
}

export default Message