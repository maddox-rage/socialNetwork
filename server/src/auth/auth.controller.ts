import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { GoogleCodeDto } from './dto/google-code.dto'
//объявления контроллера '/auth'
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// Применение валидации к методу
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/google')
	// Обработчик метода googleAuth с параметром dto типа GoogleCodeDto, полученным из тела запроса
	async googleAuth(@Body() dto: GoogleCodeDto) {
		// Вызов метода googleLogin из AuthService и возврат его результата
		return this.authService.googleLogin(dto)
	}
}
