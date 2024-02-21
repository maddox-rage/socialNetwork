import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CommentController } from './comment.controller'
import { CommentModel } from './comment.model'
import { CommentService } from './comment.service'

@Module({
	controllers: [CommentController],  // Контроллеры, относящиеся к модулю CommentModule
	providers: [CommentService],  // Провайдеры, относящиеся к модулю CommentModule
	imports: [
		TypegooseModule.forFeature([  // Импорт модели комментария для использования в модуле
			{
				typegooseClass: CommentModel,  // Класс модели комментария, определенный ранее
				schemaOptions: {
					collection: 'Comment'  // Наименование коллекции в базе данных MongoDB, где хранятся комментарии
				}
			}
		])
	]
})
export class CommentModule {}