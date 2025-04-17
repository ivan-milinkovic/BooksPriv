import express, { Request, Response } from 'express';
import Repo from '../repo';

const genresRouter = express.Router();

genresRouter.get('/genres', async (req: Request, res: Response) => {
  const allGenres = await Repo.getGenres();
  const childrenGenres = allGenres.filter((g) => g.forChildren);
  const adultGenres = allGenres.filter((g) => !g.forChildren);
  const result = {
    children: childrenGenres,
    adult: adultGenres,
  };
  res.send(result);
});

export default genresRouter;
