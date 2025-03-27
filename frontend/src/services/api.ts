import { transformKeysToCamelCase } from '../utils/formatters';

// Types
export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  isDirectory?: boolean;
  children?: Folder[];
  hasChildren?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface File {
  id: number;
  name: string;
  folderId: number | null;
  size: number;
  type: string;
  createdAt: string;
}

export interface FolderContent {
  folders: Folder[];
  files: File[];
  breadcrumb?: Folder[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
}

// Base API URL - change this to your backend API URL
const API_BASE_URL = 'http://localhost:3000/v1';

// API functions
export async function getFolderTree(): Promise<Folder[]> {
  try {
    // Instead of /folders/tree, use /folders to get root folders
    const response = await fetch(`${API_BASE_URL}/folders`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const rawResult = await response.json();
    const result: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawResult);
    
    if (!result.success) {
      return [];
    }
    
    // Get only folders from the result
    const rootFolders = result.data.folders || [];
    
    // Only make one API call per folder to check for children
    // rather than making an API call for each root folder
    const foldersWithChildInfo = await Promise.all(
      rootFolders.map(async folder => {
        try {
          const childResponse = await fetch(`${API_BASE_URL}/folders/${folder.id}`);
          if (childResponse.ok) {
            const rawChildResult = await childResponse.json();
            const childResult: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawChildResult);
            const hasChildren = !!(childResult.success && childResult.data.folders && childResult.data.folders.length > 0);
            return {
              ...folder,
              hasChildren,
              children: [] // Empty children array
            };
          }
        } catch (error) {
          console.error(`Error checking children for folder ${folder.id}:`, error);
        }
        
        return {
          ...folder,
          hasChildren: false,
          children: []
        };
      })
    );
    
    return foldersWithChildInfo;
  } catch (error) {
    console.error('Error fetching folder tree:', error);
    return [];
  }
}

// Helper function to recursively build the folder tree
export async function buildFolderTreeNode(folder: Folder, folderContents?: FolderContent): Promise<Folder> {
  try {
    // If folder contents were provided, use them instead of making an API call
    if (folderContents) {
      // We don't need to make additional API calls to check if each subfolder has children
      // Instead, we'll mark them optimistically and let the UI handle expansion when needed
      const subfolders = folderContents.folders || [];
      
      return {
        ...folder,
        hasChildren: subfolders.length > 0,
        children: subfolders.map(subfolder => ({
          ...subfolder,
          // Optimistically assume any folder might have children until expanded
          hasChildren: true, 
          children: []
        }))
      };
    }
    
    // Fetch children for this folder
    const response = await fetch(`${API_BASE_URL}/folders/${folder.id}`);
    if (!response.ok) {
      return {
        ...folder,
        hasChildren: false,
        children: []
      };
    }
    
    const rawResult = await response.json();
    const result: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawResult);
    
    if (!result.success) {
      return {
        ...folder,
        hasChildren: false,
        children: []
      };
    }
    
    // Get subfolders and prepare them for rendering
    const subfolders = result.data.folders || [];
    
    // Return the folder with its children
    return {
      ...folder,
      hasChildren: subfolders.length > 0,
      children: subfolders.map(subfolder => ({
        ...subfolder,
        // Optimistically assume any folder might have children until expanded
        hasChildren: true,
        children: []
      }))
    };
  } catch (error) {
    console.error(`Error building tree node for folder ${folder.id}:`, error);
    return {
      ...folder,
      hasChildren: false,
      children: []
    };
  }
}

export async function getFolderContents(folderId: number | null): Promise<FolderContent> {
  try {
    // For root folder (null parentId)
    const endpoint = folderId === null 
      ? `${API_BASE_URL}/folders`
      : `${API_BASE_URL}/folders/${folderId}`;
    
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const rawResult = await response.json();
    const result: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawResult);
    return result.success ? result.data : { folders: [], files: [] };
  } catch (error) {
    console.error(`Error fetching folder contents for ID ${folderId}:`, error);
    return { folders: [], files: [] };
  }
}

export async function getFolder(folderId: number): Promise<Folder | null> {
  console.warn('getFolder is deprecated - use getFolderContents instead');
  try {
    // Since we don't have a direct endpoint to get a single folder, 
    // we'll get the folder contents and extract folder info from breadcrumb
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const rawResult = await response.json();
    const result: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawResult);
    if (!result.success) {
      return null;
    }
    
    // Create a folder object with the data we have
    const folder: Folder = {
      id: folderId,
      name: '', // We'll get this from breadcrumb if available
      parentId: null,
    };
    
    // If there's breadcrumb data, the current folder is the last one
    if (result.data.breadcrumb && result.data.breadcrumb.length > 0) {
      const currentFolder = result.data.breadcrumb[result.data.breadcrumb.length - 1];
      folder.name = currentFolder.name;
      
      // If there's more than one item in breadcrumb, set parentId
      if (result.data.breadcrumb.length > 1) {
        folder.parentId = result.data.breadcrumb[result.data.breadcrumb.length - 2].id;
      }
    }
    
    return folder;
  } catch (error) {
    console.error(`Error fetching folder ID ${folderId}:`, error);
    return null;
  }
}

export async function getBreadcrumb(folderId: number): Promise<Folder[]> {
  console.warn('getBreadcrumb is deprecated - use getFolderContents instead');
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const rawResult = await response.json();
    const result: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawResult);
    return result.success && result.data.breadcrumb ? result.data.breadcrumb : [];
  } catch (error) {
    console.error(`Error fetching breadcrumb for folder ID ${folderId}:`, error);
    return [];
  }
}

export async function searchFolders(query: string): Promise<FolderContent> {
  try {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return { folders: [], files: [] };
    }
    
    const response = await fetch(`${API_BASE_URL}/folders/search?q=${encodeURIComponent(trimmedQuery)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    }
    
    const rawResult = await response.json();
    const result: ApiResponse<FolderContent> = transformKeysToCamelCase<ApiResponse<FolderContent>>(rawResult);
    if (!result.success) {
      throw new Error(result.message || 'Search failed');
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error searching folders with query "${query}":`, error);
    throw error; // Re-throw to let the store handle it
  }
}