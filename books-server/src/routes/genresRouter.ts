import express, { Request, Response } from 'express';
import { genres } from '../data';

const genresRouter = express.Router();

genresRouter.get('/genres', async (req: Request, res: Response) => {
  res.status(200);
  res.send(genres);
});

export default genresRouter;
