import { useContext } from "react";
import { AppContext, FacebookCredentials } from "../@types";
import { appContext, facebookCredentialsContext } from "../App";
import LogBtn from "./LogBtn";


const SideBar = () => {
    const {showSideBar} = useContext<AppContext>(appContext)
    const { isLoggedIn, logAction } = useContext<FacebookCredentials>(facebookCredentialsContext)
    return (
        <div className={`bg-sky-700 h-screen overflow-x-hidden ${showSideBar ? 'w-[350px]' : 'w-0'} grid  text-white place-content-center `}>
            {
                isLoggedIn ?
                    <div className="flex flex-col items-center h-fit gap-4 -mt-32">
                        <div className="h-32 w-32 rounded-full bg-transparent border-dashed border-2 border-slate-200" />
                        <span className="font-bold text-lg">John Doe</span>
                        <LogBtn onClick={() => logAction?.call(null, false)} />
                    </div>
                    :
                    <div className="">
                        <LogBtn In onClick={() => logAction?.call(null, true)} />
                    </div>
            }
        </div>
    )
}

export default SideBar