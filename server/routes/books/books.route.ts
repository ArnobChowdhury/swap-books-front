import express from 'express';
import {
  addABook,
  deleteABook,
  getHomeFeedBooks,
  getProfileBooks,
  extendBookValidity,
} from '../../controllers/books';
import { protectedRoute } from '../../middlewares/protectedRoute';
import { validation } from '../../middlewares/validation';
import {
  addBookSchema,
  deleteBookSchema,
  extendBookValiditySchema,
} from './books.validator';
import { fileUploadMW } from '../../middlewares/fileUploadMW';

const router = express.Router();

router.post(
  '/add',
  protectedRoute,
  // @ts-ignore
  fileUploadMW,
  validation(addBookSchema),
  addABook,
);
router.put(
  '/extend-book-validity',
  protectedRoute,
  validation(extendBookValiditySchema),
  extendBookValidity,
);
router.delete('/del', protectedRoute, validation(deleteBookSchema), deleteABook);
router.get('/', getHomeFeedBooks);
router.get('/:profileId', getProfileBooks);

export default router;
