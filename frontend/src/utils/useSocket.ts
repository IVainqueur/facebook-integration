import { appContext } from "./../App";
import { AppContext } from "./../@types";
import { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";

let alreadyInitialized = false;

const useSocket = (socket: Socket) => {
	const { reloadSelectedChat } = useContext<AppContext>(appContext);
	useEffect(() => {
		console.log("[UseSocket] Listening...");
		if (!alreadyInitialized) {
			socket.on("serverEvent", (data) => {
				console.log("[useSocket] A server event occured");
				console.log("[useSocket]", data);
				reloadSelectedChat?.call(null);
			});
		}
		alreadyInitialized = true;
	}, [socket, reloadSelectedChat]);
};

export default useSocket;
