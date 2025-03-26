import { FileRepository } from '../repositories/file.repository';
import { FolderRepository } from '../repositories/folder.repository';
import type { CreateFileDto, File } from '../interfaces/folder.interface';

export class FileService {
  private repository: FileRepository;
  private folderRepository: FolderRepository;

  constructor() {
    this.repository = new FileRepository();
    this.folderRepository = new FolderRepository();
  }

  async createFile(fileData: CreateFileDto): Promise<File> {
    return this.repository.createFile(fileData);
  }

  async createFileInFolder(folderId: number, fileData: Omit<CreateFileDto, 'folder_id'>): Promise<File> {
    // Check if the folder exists
    const folder = await this.folderRepository.getFolderById(folderId);
    if (!folder) {
      throw new Error(`Folder with ID ${folderId} not found`);
    }
    
    // Create the file with the verified folder ID
    const fullFileData: CreateFileDto = {
      ...fileData,
      folder_id: folderId
    };
    
    return this.repository.createFile(fullFileData);
  }

  async getFileById(id: number): Promise<File | null> {
    return this.repository.getFileById(id);
  }
} 