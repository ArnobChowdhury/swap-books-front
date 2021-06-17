import { Request, Response, NextFunction } from 'express';
import { node, Tensor3D } from '@tensorflow/tfjs-node';
import path from 'path';
import sharp from 'sharp';
import createError from 'http-errors';
import { unlink } from 'fs';
import { promisify } from 'util';
import { nsfwJSmodel } from '../utils/nsfwJSLoad';

const deleteFile = promisify(unlink);

interface PredictionProps {
  Drawing: number;
  Porn: number;
  Hentai: number;
  Neutral: number;
  Sexy: number;
}

export const nsfwMW = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.file;
    const bookPicturePath = path.join(__dirname, '..', '..', 'images', filename);
    const { data } = await sharp(bookPicturePath).toBuffer({
      resolveWithObject: true,
    });

    const pixelArray = new Uint8Array(data.buffer);
    const image = node.decodeImage(pixelArray, 3);
    const predictions = await nsfwJSmodel.classify(image as Tensor3D);
    image.dispose(); // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).

    const predictionObj: PredictionProps = {
      Hentai: 0,
      Porn: 0,
      Sexy: 0,
      Drawing: 0,
      Neutral: 0,
    };
    predictions.forEach(pred => {
      const { className, probability } = pred;
      predictionObj[className] = probability;
    });

    const { Neutral, Drawing } = predictionObj;

    if (Neutral + Drawing < 0.7) {
      await deleteFile(bookPicturePath);
      throw new createError.BadRequest('NSFW Flagged');
    } else {
      next();
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
