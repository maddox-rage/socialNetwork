import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ConversationService } from '../conversation/conversation.service';
import { DeleteMessageDto } from './delete-message.dto';
import { MessageDto } from './message.dto';
import { MessageService } from './message.service';

@WebSocketGateway(80, { cors: true })
export class MessageGateway {
	constructor(
		private readonly messageService: MessageService,
		private readonly conversationService: ConversationService,
	) {}

	@WebSocketServer()
	server: Server;

	// Обработчик события
	// Получает идентификатор диалога и отправляет соответствующий диалог клиенту
	@SubscribeMessage('message:get')
	async getConversation(@MessageBody('conversationId') conversationId: string) {
		if (!conversationId) return;

		const conversation = await this.conversationService.byId(
			new Types.ObjectId(conversationId),
		);

		this.server.to(conversationId).emit('conversation', conversation);
	}

	// Создаёт новое сообщение и обновляет соответствующий диалог
	@SubscribeMessage('message:add')
	async addMessage(@MessageBody() dto: MessageDto) {
		await this.messageService.create(new Types.ObjectId(dto.userFromId), dto);

		await this.getConversation(dto.conversationId);
	}

	// Удаляет сообщение и обновляет соответствующий диалог
	@SubscribeMessage('message:delete')
	async deleteMessage(@MessageBody() dto: DeleteMessageDto) {
		await this.messageService.delete(
			new Types.ObjectId(dto.messageId),
			dto.conversationId,
		);

		await this.getConversation(dto.conversationId);
	}

	// Присоединяет клиента к диалогу
	@SubscribeMessage('joinRoom')
	async handleRoomJoin(
		@ConnectedSocket() client: Socket,
		@MessageBody('conversationId') conversationId: string,
	) {
		// Присоединяет клиента к комнате
		client.join(conversationId);

		// Отправляет клиенту информацию о присоединении
		client.emit('joinedRoom', conversationId);

		// Получает и отправляет диалог клиенту
		await this.getConversation(conversationId);
	}

	// Отсоединяет клиента от диалога
	@SubscribeMessage('leaveRoom')
	handleRoomLeave(
		@ConnectedSocket() client: Socket,
		@MessageBody('conversationId') conversationId: string,
	) {
		client.leave(conversationId);

		client.emit('leftRoom', conversationId);
	}
}