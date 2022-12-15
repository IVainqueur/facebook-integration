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
}

export const appContext = createContext<AppContext>({ showSideBar: true, setShowSideBar: null, toggleSideBar: null })
export const facebookCredentialsContext = createContext<FacebookCredentials>({ isLoggedIn: false, logAction: null, toggleLogIn: null })

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [userInfo, setUserInfo] = useState<any>({})
	const [showSideBar, setShowSideBar] = useState<boolean>(true)
	const toggleLogIn = () => setIsLoggedIn(!isLoggedIn)
	const toggleSideBar = () => setShowSideBar(!showSideBar)
	const logAction = (to: boolean) => {
		if (to === true) {
			window.FB?.login(function (response: any) {
				console.log("[facebook::login] ", response)
				setIsLoggedIn(response.status === 'connected')
				window.localStorage.setItem('facebookCredentials', JSON.stringify(response))
				setUserInfo({ ...userInfo, ...(response.autoResponse ?? {}) })
			}, { scope: 'public_profile,email,user_photos', return_scopes: true })
		} else {
			window.FB?.logout(function (response: any) {
				console.log("[facebook::logout] ", response)
				setIsLoggedIn(response.status === 'connected')
				window.localStorage.removeItem('facebookCredentials')
				window.localStorage.removeItem('facebookUserInfo')
			})
		}

	}
	useEffect(() => {
		init();
		console.log("[App] Out of `init()`")
		console.log("[App]", window.FB)
		let handler: NodeJS.Timeout;
		handler = setInterval(async () => {
			if (facebook.initialized) clearInterval(handler)
			if (!!window.FB) {
				console.log("[facebook] initialized")
				facebook.initialized = true;
				clearInterval(handler)
				const loginStatus: any = await facebook.checkLoginStatus();
				if (loginStatus.status !== 'connected') {
					alert("You are not logged in. Please login!")
				} else {
					setIsLoggedIn(true)
				}
			}
		}, 100)
	}, [])

	useEffect(() => {
		if (isLoggedIn) {
			window.FB?.api(`/me`, { fields: ['name', 'email', 'picture'] }, (response: any) => {
				console.log("[facebook::api]", response)
				window.localStorage.setItem('facebookUserInfo', JSON.stringify(response))
				setUserInfo((prev: any) => ({ ...prev, ...response }))
				// console.log({ ...userInfo, ...response })
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoggedIn])

	useEffect(() => {
		console.log("[userInfo]", userInfo)
		console.log(`https://graph.facebook.com/${userInfo.id}/picture?type=normal`)
	}, [userInfo])

	return (
		<appContext.Provider value={{ showSideBar, setShowSideBar, toggleSideBar }}>
			<facebookCredentialsContext.Provider value={{ isLoggedIn, logAction, toggleLogIn, userInfo }}>
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
