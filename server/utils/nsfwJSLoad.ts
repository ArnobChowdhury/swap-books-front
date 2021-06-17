import { load, NSFWJS } from 'nsfwjs';

let nsfwJSmodel: NSFWJS;

export const loadNsfwModel = async () => {
  const model = await load(`file://nsfwModels/`);
  nsfwJSmodel = model;
};

export { nsfwJSmodel };
