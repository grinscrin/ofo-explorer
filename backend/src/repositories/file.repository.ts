import { prisma } from '../config/prisma';
import type { CreateFileDto, File } from '../interfaces/folder.interface';

export class FileRepository {
  async createFile(fileData: CreateFileDto): Promise<File> {
    return await prisma.file.create({
      data: {
        name: fileData.name,
        folder_id: fileData.folder_id,
        size: BigInt(fileData.size),
        type: fileData.type,
        // Store content if provided (might be in a separate table in a real app)
      }
    });
  }

  async getFileById(id: number): Promise<File | null> {
    return await prisma.file.findUnique({
      where: { id }
    });
  }
} 