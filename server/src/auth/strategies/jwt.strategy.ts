import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserModel } from '../../user/user.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	// Внедрение зависимостей: ConfigService и UserModel
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {
		// Вызов конструктора родительского класса с настройками JWT-стратегии
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение JWT из заголовка авторизации
			ignoreExpiration: true, // Игнорирование проверки срока действия JWT
			secretOrKey: configService.get('JWT_SECRET'), // Установка секретного ключа для проверки подписи JWT
		})
	}

	// Метод валидации JWT-токена и получения соответствующего UserModel
	async validate({ _id }: Pick<UserModel, '_id'>) {
		return this.UserModel.findById(_id).exec() // Возвращение найденного пользователя с указанным _id
	}
}