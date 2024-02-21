import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { getJWTConfig } from '../config/jwt.config';
import { UserModel } from '../user/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	controllers: [AuthController], // Контроллеры, связанные с модулем
	providers: [AuthService, JwtStrategy], // Провайдеры, связанные с модулем
	imports: [
		ConfigModule, // Импорт модуля конфигурации (позволяет использовать .env файлы для настройки)
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]), // Импорт модуля Typegoose для работы с MongoDB через модель UserModel
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		}), // Импорт модуля JwtModule для работы с JSON Web Tokens
		HttpModule // Импорт модуля HttpModule для выполнения HTTP-запросов
	]
})
export class AuthModule {}