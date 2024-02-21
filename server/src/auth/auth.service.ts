import { HttpService } from '@nestjs/axios'
import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { firstValueFrom, map } from 'rxjs'
import { UserModel } from '../user/user.model'
import { IGoogleProfile, IResGoogleUser } from './auth.interface'
import { GoogleCodeDto } from './dto/google-code.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}

	// Валидация пользователя и выдача access token
	async validateUser(details: IResGoogleUser) {
		// Поиск пользователя по адресу электронной почты
		let user = await this.UserModel.findOne({ email: details.email })
		// Если пользователь не найден, создаем его
		if (!user) user = await this.UserModel.create(details)

		return {
			user,
			accessToken: await this.issueAccessToken(String(user._id)) // Выдача access token со сроком действия
		}
	}

	// Выдача access token
	async issueAccessToken(userId: string) {
		const data = { _id: userId }

		return await this.jwtService.signAsync(data, {
			expiresIn: '31d' // Срок действия токена (31 день)
		})
	}

	// Получение токена доступа Google
	async getGoogleToken(code: string) {
		return firstValueFrom(
			this.httpService
				.post<{ access_token: string }>('https://oauth2.googleapis.com/token', {
					code,
					client_id: this.configService.get('GOOGLE_CLIENT_ID'), // Клиентский идентификатор Google
					client_secret: this.configService.get('GOOGLE_SECRET'), // Секретный клиентский ключ Google
					redirect_uri: 'http://localhost:3000/google-auth', // URI перенаправления после авторизации Google
					grant_type: 'authorization_code' // Тип авторизации - авторизационный код
				})
				.pipe(map((res) => res.data))
		)
	}

	// Получение профиля Google
	async getGoogleProfile(accessToken: string) {
		return firstValueFrom(
			this.httpService
				.get<IGoogleProfile>('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${accessToken}` // Передача токена доступа в заголовке Authorization
					}
				})
				.pipe(map((res) => res.data))
		)
	}

	// Авторизация через Google
	async googleLogin({ code }: GoogleCodeDto) {
		// Проверка наличия кода авторизации Google
		if (!code) {
			throw new BadRequestException('Google code not found!')
		}

		try {
			// Получение токена доступа Google
			const { access_token } = await this.getGoogleToken(code)

			// Получение профиля Google
			const profile = await this.getGoogleProfile(access_token)

			// Валидация пользователя и выдача access token
			return this.validateUser({
				email: profile.email,
				name: profile.name,
				avatarPath: profile.picture
			})
		} catch (e) {
			// Обработка ошибки исключения HTTP
			throw new HttpException(e.response.data, e.response.status)
		}
	}
}