import express from 'express';
import { createVote, getIdeasWithVotes } from '../controllers/votes-controller';
import { ipMiddleware } from '../middlewares/ipMiddleware';

const router = express.Router();

router.post('/vote/create', ipMiddleware, createVote);
router.get('/ideas-votes/get', ipMiddleware, getIdeasWithVotes);


export default router;