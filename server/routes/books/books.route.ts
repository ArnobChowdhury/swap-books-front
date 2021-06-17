import express from 'express';
import {
  addABook,
  deleteABook,
  getHomeFeedBooks,
  getProfileBooks,
  extendBookValidity,
  editBook,
  getMatchesForAbook,
  getBooksOfAMatch,
  getBooksOfARoom,
  bookIsEditable,
} from '../../controllers/books';
import { protectedRoute } from '../../middlewares/protectedRoute';
import { validation } from '../../middlewares/validation';
import {
  addBookSchema,
  deleteBookSchema,
  extendBookValiditySchema,
  editBookSchema,
} from './books.validator';
import { fileUploadMW } from '../../middlewares/fileUploadMW';
import { nsfwMW } from '../../middlewares/nsfwMW';

const router = express.Router();

router.post(
  '/add',
  protectedRoute,
  fileUploadMW,
  nsfwMW,
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
router.get('/matches', protectedRoute, getMatchesForAbook);
router.get('/books-of-match', protectedRoute, getBooksOfAMatch);
router.get('/books-of-room', protectedRoute, getBooksOfARoom);
router.get('/isEditable', protectedRoute, bookIsEditable);
router.get('/', getHomeFeedBooks);
router.get('/:profileId', getProfileBooks);
router.put(
  '/edit',
  protectedRoute,
  // @ts-ignore
  fileUploadMW,
  validation(editBookSchema),
  editBook,
);

export default router;
