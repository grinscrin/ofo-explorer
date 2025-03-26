import { Elysia } from 'elysia';
import { FileService } from '../services/file.service';
import { apiResponse } from '../utils/apiResponse';
import type { CreateFileDto } from '../interfaces/folder.interface';

export const fileController = new Elysia({ prefix: '/v1/files' })
  .post('/', async ({ body }) => {
    try {
      const fileData = body as CreateFileDto;
      const service = new FileService();
      const newFile = await service.createFile(fileData);
      return apiResponse.success(newFile, 'File created successfully');
    } catch (error) {
      return apiResponse.error('Failed to create file');
    }
  })
  .post('/in-folder/:folderId', async ({ body, params }) => {
    try {
      const folderId = Number(params.folderId);
      // Check if folder exists first
      const fileService = new FileService();
      
      const fileData = body as Omit<CreateFileDto, 'folder_id'>;
      const newFile = await fileService.createFileInFolder(folderId, fileData);
      
      return apiResponse.success(newFile, 'File created in folder successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create file in folder';
      return apiResponse.error(message);
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      const service = new FileService();
      const file = await service.getFileById(Number(params.id));
      if (!file) {
        return apiResponse.error('File not found', 404);
      }
      return apiResponse.success(file);
    } catch (error) {
      return apiResponse.error('Failed to retrieve file');
    }
  }); 