import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

import { IMediaResponse } from './media.interface'

@Injectable()
export class MediaService {
	async saveMedia(
		mediaFile: Express.Multer.File,
		folder = 'default'
	): Promise<IMediaResponse> {
		// Определяем папку  для сохранения статики
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder) // Создаем папку, если ее нет
		// Записываем содержимое медиа-файла в указанную папку
		await writeFile(
			`${uploadFolder}/${mediaFile.originalname}`,
			mediaFile.buffer
		)
		// Возвращаем объект с информацией о сохраненном медиа-файле
		return {
			url: `/uploads/${folder}/${mediaFile.originalname}`,
			name: mediaFile.originalname
		}
	}
}
