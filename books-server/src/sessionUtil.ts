import { Request, Response, NextFunction } from 'express';
import { sessionCookieName } from './config';
import { BooksSession } from './model';

export default function checkAuthHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = tryGetSession(req, res);
  if (session) {
    next();
  } else {
    res.status(401);
    res.end();
    return;
  }
}

export function tryGetSession(
  req: Request,
  res: Response,
): BooksSession | null {
  const sessionString = req.cookies[sessionCookieName];
  if (!sessionString) {
    return null;
  }
  try {
    const booksSession: BooksSession = JSON.parse(sessionString);
    return booksSession;
  } catch {
    res.clearCookie(sessionCookieName);
    return null;
  }
}
