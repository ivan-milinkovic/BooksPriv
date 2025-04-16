import express, { Request, Response } from 'express';
import { adminUser, guestUserInfo } from '../genData';
import { BooksSession, UserInfo } from '../model';
import { sessionCookieName } from '../config';
import { tryGetSession } from '../sessionUtil';

const authRouter = express.Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  if (
    req.body.email !== adminUser.email ||
    req.body.password !== adminUser.password
  ) {
    res.status(401);
    res.end();
    return;
  }
  const booksSession: BooksSession = { email: adminUser.email };
  const sessionString = JSON.stringify(booksSession);
  res.cookie(sessionCookieName, sessionString, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.end();
});

authRouter.get('/logout', async (req: Request, res: Response) => {
  res.clearCookie(sessionCookieName);
  res.status(200);
  res.end();
});

authRouter.get('/whoami', async (req: Request, res: Response) => {
  const booksSession = tryGetSession(req, res);
  if (booksSession) {
    const userInfo: UserInfo = {
      email: booksSession.email,
      isGuest: false,
    };
    res.send(userInfo);
  } else {
    res.send(guestUserInfo);
  }
});

export default authRouter;
