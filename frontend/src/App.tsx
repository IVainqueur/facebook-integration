import { createContext, useEffect, useState } from "react";
import { AppContext, FacebookCredentials } from "./@types";
import ChatArea from "./components/ChatArea";
import Chats from "./components/Chats";
import SideBar from "./components/SideBar";
import { facebook } from "./index";
import { WindowExtendedWithFacebook } from "./@types";
import { toast } from "./utils/utils";
import { io } from 'socket.io-client'
import useSocket from "./utils/useSocket";

declare let window: WindowExtendedWithFacebook;


const init = async function () {
	if (facebook.initialized) return;
	console.log('[facebook] Initializing...')
	await facebook.initFacebookSDK();
}

export const appContext = createContext<AppContext>({
	showSideBar: true,
	setShowSideBar: null,
	toggleSideBar: null,
	chats: null,
	selectedChat: null,
	setSelectedChatId: null,
	sendMessage: null,
	reloadSelectedChat: null
})

export const facebookCredentialsContext = createContext<FacebookCredentials>({
	isLoggedIn: false,
	logAction: null,
	toggleLogIn: null
})

const socket = io(process.env.REACT_APP_SOCKET_URI ?? "https://sm-converse.cyclic.app")

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [userInfo, setUserInfo] = useState<any>({})
	const [showSideBar, setShowSideBar] = useState<boolean>(true)
	const [chats, setChats] = useState<object[] | null>(null)
	const [selectedChat, setSelectedChat] = useState<object | null>(null)
	const toggleLogIn = () => setIsLoggedIn(!isLoggedIn)
	const toggleSideBar = () => setShowSideBar(!showSideBar)

	const logAction = (to: boolean) => {
		const { hide: hideToast } = toast('loading', `Logging you ${to ? 'in' : 'out'}`, { hideAfter: isLoggedIn ? 1 : 0 })
		if (to === true) {
			window.FB?.login(function (response: any) {
				setIsLoggedIn(response.status === 'connected')
				window.localStorage.setItem('facebookCredentials', JSON.stringify(response))
				setUserInfo({ ...userInfo, ...(response.autoResponse ?? {}) })
				hideToast();
			}, { scope: 'public_profile,email,user_photos', return_scopes: true })
		} else {
			window.FB?.logout(function (response: any) {
				setIsLoggedIn(response.status === 'connected')
				window.localStorage.removeItem('facebookCredentials')
				window.localStorage.removeItem('facebookUserInfo')
				window.location.reload()
			})
		}

	}
	useSocket(socket);
	useEffect(() => {
		init();
		let handler: NodeJS.Timeout;
		handler = setInterval(async () => {
			if (facebook.initialized) {
				clearInterval(handler)
				return;
			}
			if (!!window.FB) {
				console.log("[facebook] initialized")
				facebook.initialized = true;
				clearInterval(handler)
				const loginStatus: any = await facebook.checkLoginStatus();
				if (loginStatus.status !== 'connected') {
					toast('error', 'You are not logged in! Please login.', { hideAfter: 3 })
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
				window.localStorage.setItem('facebookUserInfo', JSON.stringify(response))
				setUserInfo((prev: any) => ({ ...prev, ...response }))
			})

			window.FB?.api(`/${process.env.REACT_APP_PAGE_ID}/conversations?access_token=${process.env.REACT_APP_PAGE_SECRET}`,
				{
					fields: ['participants', 'profile_pic']
				}
				, (response: any) => {
					if (response.error) return
					// console.log('[conversations] ', response.data)
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
	}, [userInfo])

	const setSelectedChatId = (id: string, options: any) => {
		const { hide: hideToast } = toast('loading', `Opening chats with ${options.username}`)
		window.FB?.api(`/${id}/messages?access_token=${process.env.REACT_APP_PAGE_SECRET}`, { fields: ['message', 'from', 'picture'] }, (response: any) => {
			hideToast();
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
		window.FB?.api(`/me/messages?access_token=${process.env.REACT_APP_PAGE_SECRET}`, 'POST', {
			recipient: { id: options.userId },
			message: { text: message }
		}, (response: any) => {
			console.log("[sendMessage]", response)
		})
	}
	const reloadSelectedChat = () => {
		console.log('[reloadSelectedChat] reloading...')
	}
	return (
		<appContext.Provider value={{ showSideBar, setShowSideBar, toggleSideBar, chats, selectedChat, setSelectedChatId, sendMessage, reloadSelectedChat }}>
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
