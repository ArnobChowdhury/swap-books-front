import express from 'express';
import {
  addABook,
  deleteABook,
  getHomeFeedBooks,
  getProfileBooks,
} from '../controllers/books';
import { protectedRoute } from '../middlewares/protectedRoute';

const router = express.Router();

router.post('/add', protectedRoute, addABook);
router.delete('/del', protectedRoute, deleteABook);
router.get('/', getHomeFeedBooks);
router.get('/:profileId', getProfileBooks);

export default router;
