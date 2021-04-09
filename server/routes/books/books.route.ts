import express from 'express';
import {
  addABook,
  deleteABook,
  getHomeFeedBooks,
  getProfileBooks,
} from '../../controllers/books';
import { protectedRoute } from '../../middlewares/protectedRoute';
import { validation } from '../../middlewares/validation';
import { addBookSchema, deleteBookSchema } from './books.validator';
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
router.delete('/del', protectedRoute, validation(deleteBookSchema), deleteABook);
router.get('/', getHomeFeedBooks);
router.get('/:profileId', getProfileBooks);

export default router;
