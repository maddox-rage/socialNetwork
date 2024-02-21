import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/user.model'
import { PostModel } from '../post/post.model'

// Объявление интерфейса для модели комментария
export interface CommentModel extends Base {}

// Определение класса модели комментария
export class CommentModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	user: Ref<UserModel>

	@prop({ ref: () => PostModel })
	post: Ref<PostModel>

	@prop()
	message: string
}