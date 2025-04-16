import express, { Request, Response } from 'express';
import { genres } from '../genData';

const genresRouter = express.Router();

genresRouter.get('/genres', async (req: Request, res: Response) => {
  res.status(200);
  res.send(genres);
});

export default genresRouter;
