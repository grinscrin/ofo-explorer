import { FolderRepository } from '../repositories/folder.repository';
import type { FolderContent, FolderTree, CreateFolderDto, Folder, BreadcrumbItem } from '../interfaces/folder.interface';

export class FolderService {
  private repository: FolderRepository;

  constructor() {
    this.repository = new FolderRepository();
  }

  async createFolder(folderData: CreateFolderDto): Promise<Folder> {
    return this.repository.createFolder(folderData);
  }

  async getFullStructure(): Promise<FolderTree[]> {
    return this.repository.getFullHierarchy();
  }

  async getRootContent(): Promise<FolderContent> {
    try {
      // Get content where parent_id is null (root level)
      const result = await this.repository.getRootContent();
      return result;
    } catch (error) {
      // Return an empty result instead of throwing
      return { folders: [], files: [] };
    }
  }

  async getFolderContent(parentId: number): Promise<FolderContent> {
    return this.repository.getFolderContent(parentId);
  }

  async getBreadcrumbPath(folderId: number): Promise<BreadcrumbItem[]> {
    try {
      return await this.repository.getBreadcrumbPath(folderId);
    } catch (error) {
      console.error('Error getting breadcrumb path:', error);
      return [];
    }
  }

  async searchContent(query: string): Promise<FolderContent> {
    try {
      console.log(`Service: searching for "${query}"`);
      const sanitizedQuery = query.trim();
      
      if (!sanitizedQuery) {
        console.warn('Empty search query provided');
        return { folders: [], files: [] };
      }
      
      const results = await this.repository.searchContent(sanitizedQuery);
      console.log(`Search found ${results.folders.length} folders and ${results.files.length} files`);
      
      return results;
    } catch (error) {
      console.error('Error in search service:', error);
      // Return empty results instead of throwing
      return { folders: [], files: [] };
    }
  }
}