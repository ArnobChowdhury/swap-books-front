import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const fileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'images');
  },
  filename: (_req, file, cb) => {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (firstArg: null, secondArg: boolean) => void,
): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  // @ts-ignore
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('bookImage');

export const fileUploadMW = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      // @ts-ignore
      err.statusCode = 400;
      next(err);
    } else if (err) {
      next(err);
    }
    next();
  });
};
