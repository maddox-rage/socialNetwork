import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform
} from '@nestjs/common'
import { Types } from 'mongoose'
// Пайп для валидации id
export class IdValidationPipe implements PipeTransform {
	transform(value: string, meta: ArgumentMetadata) {
		if (meta.type !== 'param') return value; // Если тип не param, то возвращаем значение

		if (!Types.ObjectId.isValid(value)) // Фвляется ли значение валидным
			throw new BadRequestException('Invalid format id'); // Если идентификатор невалидный, выбрасываем ошибку

		return value; // возвращаем его без изменений
	}
}
