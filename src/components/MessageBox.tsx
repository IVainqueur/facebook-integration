const MessageBox = () => {
  return (
    <div className="h-[80px] w-full border-t border-t-gray-300 flex items-center px-4 gap-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <input type="text" placeholder="Aa" className="bg-gray-100 rounded-full w-3/4 py-3 px-8 outline-none" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />

    </div>
  )
}

export default MessageBox