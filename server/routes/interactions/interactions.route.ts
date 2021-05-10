import express from 'express';
import { protectedRoute } from '../../middlewares/protectedRoute';
import { getMsgs } from '../../controllers/interactions';

const router = express.Router();

router.get('/msgs', protectedRoute, getMsgs);

export default router;
