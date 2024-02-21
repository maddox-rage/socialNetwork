import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import * as fs from 'fs-extra';

describe('MediaService', () => {
    let mediaService: MediaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MediaService],
        }).compile();

        mediaService = module.get<MediaService>(MediaService);
    });

    afterEach(async () => {
        // Удаление файла после каждого теста
        const uploadFolder = './uploads/default';
        const filePath = `${uploadFolder}/image.jpg`;
        if (await fs.pathExists(filePath)) {
            await fs.unlink(filePath);
        }
    });

    it('should save media file and verify its existence', async () => {
        const mediaFile: Express.Multer.File = {
            fieldname: 'file',
            originalname: 'image.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: Buffer.from('file-content'),
            size: 123,
            destination: '',
            filename: '',
            path: '',
            stream: null,
        };

        const result = await mediaService.saveMedia(mediaFile);

        // Проверка возвращаемых данных
        expect(result).toEqual({
            url: '/uploads/default/image.jpg',
            name: 'image.jpg',
        });

        // Проверка наличия файла в указанном пути
        const fileExists = await fs.pathExists(`./uploads/default/image.jpg`);
        expect(fileExists).toBeTruthy();
    });
});