import express, { Request, Response } from 'express';
import { Author } from '../model';
import { addAuthor, authors } from '../data';
import { tryGetSession } from '../sessionUtil';

const authorsRouter = express.Router();

authorsRouter.get('/authors', async (req: Request, res: Response) => {
  res.send(authors);
});

authorsRouter.post('/authors', async (req: Request, res: Response) => {
  const body = req.body;
  const newAuthor: Author = {
    id: authors.length,
    name: body.name,
    bio: body.bio,
    dateOfBirth: new Date(body.dateOfBirth),
  };
  if (tryGetSession(req, res) === null) {
    res.status(401);
    res.end();
    return;
  }
  addAuthor(newAuthor);
  res.status(200);
  res.send(newAuthor);
});

export default authorsRouter;
