export interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface File {
  id: number;
  name: string;
  folder_id: number | null;
  size: bigint;
  type: string;
  created_at: Date;
}

export interface FolderContent {
  folders: Folder[];
  files: File[];
  breadcrumb?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  id: number;
  name: string;
}

export interface CreateFolderDto {
  name: string;
  parent_id: number | null;
}

export interface CreateFileDto {
  name: string;
  folder_id: number;
  size: number;
  type: string;
  content?: string;
}

export interface FolderTree extends Folder {
  children?: FolderTree[];
}

export type FolderTreeResponse = FolderTree[];
export type FolderContentResponse = FolderContent;