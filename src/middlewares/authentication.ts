import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function verify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ticket = await client.verifyIdToken({
    idToken: req.headers.authorization as string,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  req.user = payload?.sub;

  next();
}
