import express from 'express';
import { getIdeas } from '../controllers/ideas-controller';

const router = express.Router();

router.get('/ideas/get', getIdeas);


export default router;