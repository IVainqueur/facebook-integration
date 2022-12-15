import ChatCard from "./ChatCard"
import { FiMenu } from 'react-icons/fi'
import { MouseEventHandler, useContext } from "react"
import { AppContext } from "../@types"
import { appContext } from "../App"

const Chats = () => {
  const { toggleSideBar, chats } = useContext<AppContext>(appContext)
  return (
    <div className="p-6 rounded-l-lg w-[400px] h-screen border-r-2 border-r-slate-200">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 hover:-rotate-6 cursor-pointer" onClick={toggleSideBar as MouseEventHandler}>
          <FiMenu className="" />
        </div>
        <h1 className="text-xl font-bold">Chats</h1>
      </div>
      <div className="ChatCards flex flex-col gap-3">
        {
          !!chats ?
            <>
              {
                chats.map((chat, i: number) => {
                  console.log("[chat]", chat)
                  return <ChatCard {...chat} key={`chatCard-${i}`} />
                })
              }

            </> :
            <>
              {
                Array(5).fill(null).map((chat, i: number) => {
                  return <ChatCard skeleton key={`chatCard-${i}`} />
                })
              }
            </>
        }
      </div>
    </div>
  )
}

export default Chats