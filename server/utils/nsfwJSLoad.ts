import { load, NSFWJS } from 'nsfwjs';
import * as tf from '@tensorflow/tfjs';

if (process.env.NODE_ENV === 'production') tf.enableProdMode();

let nsfwJSmodel: NSFWJS;

export const loadNsfwModel = async () => {
  const model = await load(`file://nsfwModels/`);
  nsfwJSmodel = model;
};

export { nsfwJSmodel };
