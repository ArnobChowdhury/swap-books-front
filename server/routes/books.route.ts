import express from 'express';
import { addABook, getHomeFeedBooks, getProfileBooks } from '../controllers/books';
import { protectedRoute } from '../middlewares/protectedRoute';

const router = express.Router();

router.post('/add', protectedRoute, addABook);
router.get('/', getHomeFeedBooks);
router.get('/:profileId', getProfileBooks);

export default router;
