import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export function CustomFileInterceptor(
  fieldName: string,
  uploadPath: string,
  fileFilter: 'image',
  fileName?: string,
) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: uploadPath,
      filename: (req, file, callback) => {
        if (!file) {
          callback(null, null);
          return;
        }

        const ext = extname(file.originalname);
        const randomName = (): string => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          return `${file.fieldname}-${uniqueSuffix}${ext}`;
        };
        const finalName = fileName ? `${fileName}${ext}` : randomName();
        callback(null, finalName);
        //   callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file) {
        callback(null, true);
        return;
      }

      switch (fileFilter) {
        case 'image':
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(
              new BadRequestException('Only image files are allowed!'),
              false,
            );
          }
          break;
      }
      callback(null, true);
    },
  });
}
