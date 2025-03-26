import { Elysia } from 'elysia';
import { FolderService } from '../services/folder.service';
import { FileService } from '../services/file.service';
import { apiResponse } from '../utils/apiResponse';
import type { FolderContentResponse, FolderTreeResponse, CreateFolderDto, CreateFileDto } from '../interfaces/folder.interface';

export const folderController = new Elysia({ prefix: '/v1/folders' })
  // Create a new folder
  .post('/', async ({ body }) => {
    try {
      const folderData = body as CreateFolderDto;
      const service = new FolderService();
      const newFolder = await service.createFolder(folderData);
      return apiResponse.success(newFolder, 'Folder created successfully');
    } catch (error) {
      return apiResponse.error('Failed to create folder');
    }
  })
  // Get root folders and files
  .get('/', async () => {
    try {
      console.log('Getting root folders');
      const service = new FolderService();
      const data = await service.getRootContent();
      
      return apiResponse.success<FolderContentResponse>(
        data, 
        'Root directory contents'
      );
    } catch (error) {
      console.error('Error getting root contents:', error);
      return apiResponse.error('Failed to load root directory');
    }
  })
  // Get specific folder contents
  .get('/:id', async ({ params }) => {
    try {
      const folderId = Number(params.id);
      console.log(`Getting folder with ID: ${folderId}`);
      
      const service = new FolderService();
      const data = await service.getFolderContent(folderId);
      
      // Add breadcrumb data
      data.breadcrumb = await service.getBreadcrumbPath(folderId);
      
      return apiResponse.success<FolderContentResponse>(
        data, 
        `Contents of folder ID: ${folderId}`
      );
    } catch (error) {
      console.error('Error getting folder contents:', error);
      return apiResponse.error('Failed to load folder contents');
    }
  })
  // Get complete folder hierarchy as tree (for special cases)
  .get('/tree', async () => {
    try {
      const service = new FolderService();
      const data = await service.getFullStructure();
      return apiResponse.success<FolderTreeResponse>(data, 'Full folder hierarchy');
    } catch (error) {
      return apiResponse.error('Failed to load folder structure');
    }
  })
  // Create a file in a specific folder
  .post('/:id/files', async ({ body, params }) => {
    try {
      const folderId = Number(params.id);
      const fileData = body as Omit<CreateFileDto, 'folder_id'>;
      
      const fileService = new FileService();
      const newFile = await fileService.createFileInFolder(folderId, fileData);
      
      return apiResponse.success(newFile, 'File created in folder successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create file in folder';
      return apiResponse.error(message);
    }
  })
  // Search across folders and files
  .get('/search', async ({ query }) => {
    try {
      const searchQuery = query.q as string | undefined;
      
      // Validate search query
      if (!searchQuery || searchQuery.trim() === '') {
        return apiResponse.error('Search query is required', 400);
      }
      
      console.log(`Searching for: "${searchQuery}"`);
      const service = new FolderService();
      const data = await service.searchContent(searchQuery);
      
      return apiResponse.success<FolderContentResponse>(
        data, 
        `Search results for: "${searchQuery}"`
      );
    } catch (error) {
      console.error('Search error:', error);
      const message = error instanceof Error ? error.message : 'Search failed';
      return apiResponse.error(message);
    }
  });