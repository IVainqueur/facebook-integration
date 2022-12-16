import { appContext } from "./../App";
import { AppContext } from "./../@types";
import { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";

const useSocket = (socket: Socket) => {
	const { reloadSelectedChat } = useContext<AppContext>(appContext);
	useEffect(() => {
		console.log("[UseSocket] Listening...");
		socket.on("serverEvent", (data) => {
			console.log("[useSocket] A server event occured");
			console.log("[useSocket]", data);
			reloadSelectedChat?.call(null);
		});
	}, [socket, reloadSelectedChat]);
};

export default useSocket;
