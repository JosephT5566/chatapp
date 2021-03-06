import { createServer } from 'http';
import { Socket, Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT'],
		credentials: true,
	},
});

io.on('connection', (socket: Socket) => {
	const id: string = socket.handshake.query.id as string;
	socket.join(id);

	socket.on('send-message', ({ recipients, text }: { recipients: Array<string>; text: string }) => {
		recipients.forEach((recipient) => {
			const newRecipients = recipients.filter((r) => r !== recipient);
			newRecipients.push(id);
			socket.broadcast.to(recipient).emit('receive-message', {
				recipients: newRecipients,
				sender: id,
				text,
			});
		});
	});
});

httpServer.listen(5000);
