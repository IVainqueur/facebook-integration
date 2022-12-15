import { createContext, useEffect, useState } from "react";
import { AppContext, FacebookCredentials } from "./@types";
import ChatArea from "./components/ChatArea";
import Chats from "./components/Chats";
import SideBar from "./components/SideBar";
import { facebook } from "./index";
import { WindowExtendedWithFacebook } from "./@types";

declare let window: WindowExtendedWithFacebook;


const init = async function () {
	if (facebook.initialized) return;
	console.log('[facebook] Initializing...')
	await facebook.initFacebookSDK();
	console.log("[facebook] initialized")
	// console.log("[facebook] Checking Status...")
	// await facebook.checkLoginStatus()
	facebook.initialized = true;
}

export const appContext = createContext<AppContext>({ showSideBar: true, setShowSideBar: null, toggleSideBar: null })
export const facebookCredentialsContext = createContext<FacebookCredentials>({ isLoggedIn: false, logAction: null, toggleLogIn: null })

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [showSideBar, setShowSideBar] = useState<boolean>(true)
	const toggleLogIn = () => setIsLoggedIn(!isLoggedIn)
	const toggleSideBar = () => setShowSideBar(!showSideBar)
	const logAction = (to: boolean) => {
		setIsLoggedIn(to);
	}
	useEffect(() => {
		init();
		console.log("[App] Out of `init()`")
		console.log("[App]", window.FB)
	}, [])
	return (
		<appContext.Provider value={{ showSideBar, setShowSideBar, toggleSideBar }}>
			<facebookCredentialsContext.Provider value={{ isLoggedIn, logAction, toggleLogIn }}>
				<div className="flex bg-sky-700">
					<SideBar />
					<main className="grow bg-white rounded-l-lg flex ">
						<Chats />
						<ChatArea />
					</main>
				</div>
			</facebookCredentialsContext.Provider>
		</appContext.Provider >
	);
}

export default App;
