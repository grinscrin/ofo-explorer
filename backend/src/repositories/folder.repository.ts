import { prisma } from '../config/prisma';
import type { Folder, File, FolderContent, FolderTree, CreateFolderDto, BreadcrumbItem } from '../interfaces/folder.interface';

export class FolderRepository {
  async createFolder(folderData: CreateFolderDto): Promise<Folder> {
    return await prisma.folder.create({
      data: {
        name: folderData.name,
        parent_id: folderData.parent_id
      }
    });
  }

  async getFolderById(id: number): Promise<Folder | null> {
    return await prisma.folder.findUnique({
      where: { id }
    });
  }

  async getBreadcrumbPath(folderId: number): Promise<BreadcrumbItem[]> {
    const breadcrumb: BreadcrumbItem[] = [];
    let currentFolder: Folder | null = await this.getFolderById(folderId);
    
    // Start with the current folder and traverse up
    while (currentFolder) {
      // Add current folder to the beginning of breadcrumb
      breadcrumb.unshift({
        id: currentFolder.id,
        name: currentFolder.name
      });
      
      // If there's a parent, get it and continue
      if (currentFolder.parent_id) {
        currentFolder = await this.getFolderById(currentFolder.parent_id);
      } else {
        // No parent means we've reached the root
        break;
      }
    }
    
    return breadcrumb;
  }

  async getRootContent(): Promise<FolderContent> {
    try {
      // Get folders at the root level (null parent_id)
      const folders = await prisma.folder.findMany({ 
        where: { parent_id: null },
        orderBy: { name: 'asc' }
      });
      
      // Before the schema update, we can't have root-level files
      // so we're just returning an empty array for files
      const files: File[] = [];

      console.log('getRootContent', folders, files);
      
      return { folders, files };
    } catch (error) {
      console.error('Error in getRootContent:', error);
      // Return empty results rather than failing
      return { folders: [], files: [] };
    }
  }

  async getFullHierarchy(): Promise<FolderTree[]> {
    const folders = await prisma.$queryRaw<Folder[]>`
      WITH RECURSIVE folder_tree AS (
        SELECT id, name, parent_id, created_at
        FROM folders
        WHERE parent_id IS NULL
        UNION ALL
        SELECT f.id, f.name, f.parent_id, f.created_at
        FROM folders f
        INNER JOIN folder_tree ft ON ft.id = f.parent_id
      )
      SELECT * FROM folder_tree
    `;
    return this.buildNestedStructure(folders);
  }

  private buildNestedStructure(folders: Folder[]): FolderTree[] {
    const map = new Map<number, FolderTree>();
    const roots: FolderTree[] = [];

    folders.forEach(folder => {
      map.set(folder.id, { ...folder, children: [] });
    });

    folders.forEach(folder => {
      if (folder.parent_id) {
        const parent = map.get(folder.parent_id);
        parent?.children?.push(map.get(folder.id)!);
      } else {
        roots.push(map.get(folder.id)!);
      }
    });

    return roots;
  }

  async getFolderContent(parentId: number): Promise<FolderContent> {
    const [folders, files] = await Promise.all([
      prisma.folder.findMany({ 
        where: { parent_id: parentId },
        orderBy: { name: 'asc' }
      }),
      prisma.file.findMany({ 
        where: { folder_id: parentId },
        orderBy: { name: 'asc' }
      })
    ]);
    return { folders, files };
  }

  async searchContent(query: string): Promise<FolderContent> {
    try {
      console.log(`Repository: performing search for "${query}"`);
      
      if (!query || query.trim() === '') {
        console.warn('Repository: Empty search query received');
        return { folders: [], files: [] };
      }
      
      // Ensure query is properly formatted for database search
      const sanitizedQuery = query.trim();
      
      // Perform search with error handling for each promise
      const [folders, files] = await Promise.all([
        prisma.folder.findMany({
          where: { 
            name: { 
              contains: sanitizedQuery
            } 
          },
          take: 100,
          orderBy: { name: 'asc' }
        }).catch((err: Error) => {
          console.error('Error searching folders:', err);
          return [];
        }),
        
        prisma.file.findMany({
          where: { 
            name: { 
              contains: sanitizedQuery
            } 
          },
          take: 100,
          orderBy: { name: 'asc' }
        }).catch((err: Error) => {
          console.error('Error searching files:', err);
          return [];
        })
      ]);
      
      console.log(`Repository: search complete - found ${folders.length} folders and ${files.length} files`);
      return { folders, files };
    } catch (error) {
      console.error('Repository: search error:', error);
      // Return empty results rather than failing
      return { folders: [], files: [] };
    }
  }
}