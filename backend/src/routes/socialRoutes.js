import express from 'express';
import { getInstagramFeed } from '../controllers/socialController.js';

const router = express.Router();

router.get('/instagram', getInstagramFeed);

export default router;
