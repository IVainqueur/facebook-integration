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

export const appContext = createContext<AppContext>({ showSideBar: true, setShowSideBar: null, toggleSideBar: null, chats: null, selectedChat: null, setSelectedChatId: null, sendMessage: null })
export const facebookCredentialsContext = createContext<FacebookCredentials>({ isLoggedIn: false, logAction: null, toggleLogIn: null })

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [userInfo, setUserInfo] = useState<any>({})
	const [showSideBar, setShowSideBar] = useState<boolean>(true)
	const [chats, setChats] = useState<object[] | null>(null)
	const [selectedChat, setSelectedChat] = useState<object | null>(null)
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
			// Loading Necessary User Data
			window.FB?.api(`/me`, { fields: ['name', 'email', 'picture'] }, (response: any) => {
				console.log("[facebook::api]", response)
				window.localStorage.setItem('facebookUserInfo', JSON.stringify(response))
				setUserInfo((prev: any) => ({ ...prev, ...response }))
			})

			window.FB?.api(`/${process.env.REACT_APP_PAGE_ID}/conversations?access_token=${process.env.REACT_APP_PAGE_SECRET}`,
				{
					fields: ['participants', 'profile_pic']
				}
				, (response: any) => {
					if (response.error) return
					console.log('[conversations] ', response.data)
					setChats(prev => {
						return response.data.map((chat: any) => {
							return {
								username: chat.participants.data[0].name,
								id: chat.id,
								userId: chat.participants.data[0].id
							}
						})
					})

				})

		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoggedIn])

	useEffect(() => {
		console.log("[userInfo]", userInfo)
		console.log(`https://graph.facebook.com/${userInfo.id}/picture?type=normal`)
	}, [userInfo])

	const setSelectedChatId = (id: string, options: any) => {
		console.log("[id]", id)
		window.FB?.api(`/${id}/messages?access_token=${process.env.REACT_APP_PAGE_SECRET}`, { fields: ['message', 'from', 'picture'] }, (response: any) => {
			console.log('[conversations] ', response)
			setSelectedChat((prev: any): object => {
				return {
					username: options.username,
					id,
					userId: options.userId,
					messages: response.data.map((chat: any) => {
						return {
							content: chat.message,
							fromMe: chat.from.name !== options.username
						}
					}).reverse()
				}
			})
		})
	}

	const sendMessage = (message: string, options: any) => {
		console.log({ message, id: options.userId })
		window.FB?.api(`/me/messages?access_token=${process.env.REACT_APP_PAGE_SECRET}`, 'POST', {
			recipient: { id: options.userId },
			message: { text: message }
		}, (response: any) => {
			console.log("[sendMessage]", response)
		})
	}

	return (
		<appContext.Provider value={{ showSideBar, setShowSideBar, toggleSideBar, chats, selectedChat, setSelectedChatId, sendMessage }}>
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
