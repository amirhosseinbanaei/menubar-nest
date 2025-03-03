import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

export async function DeleteUploadedFile(
  fieldName: 'categories' | 'items' | 'company',
  fileName: string,
) {
  const filePath = path.join(
    __dirname,
    `../../../uploads/${fieldName}/${fileName}`,
  );
  try {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new BadRequestException('Error deleting file');
      }
    });
  } catch (error) {
    throw new BadRequestException({
      status: 'error',
      message: 'Error deleting file',
      error,
    });
  }
}
