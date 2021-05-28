import { createReadStream } from 'fs';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export const resize = (
  path: string,
  format: 'jpeg' | 'jpg' | 'png',
  width: number,
  height: number,
) => {
  const readStream = createReadStream(path);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height, {
      fit: 'outside',
    });
  }

  return readStream.pipe(transform);
};

export const fileResizeMW = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { w: widthString, h: heightString, f: formatString } = req.query;
    const { filename } = req.params;

    const width = Number(widthString);
    const height = Number(heightString);
    const format = (formatString as string) || 'jpg';

    res.type(`image/${format}`);
    const pathToImage = path.join(__dirname, '../', '../', './images', filename);

    // @ts-ignore
    resize(pathToImage, format, width, height).pipe(res);
  } catch (err) {
    next(err);
  }
};
