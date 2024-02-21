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
import { ConversationDto } from './conversation.dto'
import { ConversationService } from './conversation.service'

@Controller('conversation')
export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	@Get(':id')
	@Auth()
	async getById(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.conversationService.byId(id)
	}

	@UsePipes(new ValidationPipe())// Используется ValidationPipe для валидации входных данных из тела запроса
	@HttpCode(200)
	@Post()
	@Auth()
	async createConversation(
		@Body() { withUserId }: ConversationDto, // Извлекаем данные из тела запроса с помощью декоратора
		@CurrentUser('_id') currentUserId: Types.ObjectId // Извлекаем текущего пользователя из декоратора @CurrentUser()
	) {
		return this.conversationService.create(
			currentUserId,
			new Types.ObjectId(withUserId)
		)
	}
}
