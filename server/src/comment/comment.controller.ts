import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '../auth/auth.decorator'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { CurrentUser } from '../user/decorators/user.decorator'
import { CommentDto } from './comment.dto'
import { CommentService } from './comment.service'

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	// Получение комментариев по идентификатору видео
	@Get('by-post/:postId')
	async getCommentByVideoId(
		@Param('postId', IdValidationPipe) postId: Types.ObjectId
	) {
		return this.commentService.byPostId(postId)
	}

	// Создание комментария
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth() // Требуется авторизация
	async createComment(
		@CurrentUser('_id') _id: Types.ObjectId, // Идентификатор текущего пользователя, полученный из декоратора
		@Body() dto: CommentDto // Данные комментария, полученные из тела запроса
	) {
		return this.commentService.create(_id, dto)
	}
}