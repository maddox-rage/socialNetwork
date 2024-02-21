import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { MessageModel } from '../message/message.model'

export interface ConversationModel extends Base {}

export class ConversationModel extends TimeStamps {
	// Поле 'messages' будет содержать ссылки на сообщения, связанные с данной беседой
	@prop({ default: [], ref: () => MessageModel })
	messages?: Ref<MessageModel>[]
}
