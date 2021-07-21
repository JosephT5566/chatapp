import React, { useState, useEffect, createContext, ReactChild, useContext } from 'react';
import io, { Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';

export type SocketContent = {
	socket: Socket;
};

const SocketContext = createContext<SocketContent>({ socket: io(SERVER_URL) });

export const useSocket = () => {
	return useContext(SocketContext);
};

export default function SocketProvider(props: { id: string; children: ReactChild }) {
	const { id, children } = props;
	const [socket, setSocket] = useState(io(SERVER_URL));

	useEffect(() => {
		const newSocket = io(SERVER_URL, { query: { id } });
		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, [id]);

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
