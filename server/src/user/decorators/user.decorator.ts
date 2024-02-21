import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserModel } from '../user.model'

// Создаем пользовательский параметрный декоратор с именем CurrentUser
export const CurrentUser = createParamDecorator(
	// Функция, которая выполняется при использовании декоратора
	(data: keyof UserModel, ctx: ExecutionContext) => {
		// Получаем доступ к объекту запроса из контекста выполнения
		const request = ctx.switchToHttp().getRequest()

		// Получаем пользователя из объекта запроса
		const user = request.user

		// Если передан параметр data, возвращаем указанное свойство пользователя
		// В противном случае, возвращаем весь объект пользователя
		return data ? user[data] : user
	}
)