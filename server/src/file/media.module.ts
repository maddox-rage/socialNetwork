import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
	imports: [
		// Импортирование модуля  для обслуживания статики
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		})
	],
	controllers: [MediaController],// Регистрация контроллера MediaController
	providers: [MediaService]
})
export class MediaModule {}
