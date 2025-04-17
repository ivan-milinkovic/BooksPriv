import express, { Request, Response } from 'express';
import { CreateAuthorData } from '../model';
import checkAuthHandler, { tryGetSession } from '../sessionUtil';
import Repo from '../repo';

const authorsRouter = express.Router();

authorsRouter.get('/authors', async (req: Request, res: Response) => {
  const authors = await Repo.getAuthors();
  res.send(authors);
});

authorsRouter.post(
  '/authors',
  checkAuthHandler,
  async (req: Request, res: Response) => {
    const body = req.body;
    const newAuthor: CreateAuthorData = {
      name: body.name,
      bio: body.bio,
      dateOfBirth: new Date(body.dateOfBirth),
    };
    await Repo.createAuthor(newAuthor);
    res.status(200);
    res.send(newAuthor);
  },
);

export default authorsRouter;
