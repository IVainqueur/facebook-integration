export interface AppEvents {
    logPageView: Function;
}

export interface FB {
	init: Function;
	AppEvents?: AppEvents;
    getLoginStatus: Function
}

export interface WindowExtendedWithFacebook extends Window {
	fbAsyncInit?: Function;
	FB?: FB;
}

export interface FacebookCredentials {
	isLoggedIn: boolean;
	logAction: Function | null | undefined;
	toggleLogIn: Function | null | undefined;
}

export interface AppContext {
	showSideBar: boolean;
	setShowSideBar: Function | null | undefined;
	toggleSideBar: Function | null | undefined;
}