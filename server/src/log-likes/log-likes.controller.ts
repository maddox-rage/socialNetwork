import { Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '../auth/auth.decorator'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { CurrentUser } from '../user/decorators/user.decorator'
import { LogLikesService } from './log-likes.service'

@Controller('log-likes')
export class LogLikesController {
	constructor(private readonly logLikesService: LogLikesService) {}
	// Роут для проверки существования лайка пользователя по идентификатору поста
	@Get('check-exists/:postId')
	@Auth()
	async checkExists(
		@Param('postId', IdValidationPipe) postId: Types.ObjectId,
		@CurrentUser('_id') userId: Types.ObjectId
	) {
		return this.logLikesService.checkExists(userId, postId)
	}
// Роут для получения общего количества лайков по идентификатору поста
	@Get('get-count/:postId')
	async getAllCount(@Param('postId', IdValidationPipe) postId: Types.ObjectId) {
		return this.logLikesService.getAllCount(postId)
	}
// Роут для переключения состояния лайка пользователя по идентификатору поста
	@HttpCode(200)
	@Put(':postId')
	@Auth()
	async toggleLog(
		@Param('postId', IdValidationPipe) postId: Types.ObjectId,
		@CurrentUser('_id') userId: Types.ObjectId
	) {
		return this.logLikesService.toggle(userId, postId)
	}
}
