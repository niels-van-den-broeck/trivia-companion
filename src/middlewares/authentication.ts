import { RequestHandler } from 'express';
import { OAuth2Client } from 'google-auth-library';
import db from '../services/db';
import HttpError from '../services/http-error';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verify: RequestHandler = async (req, res, next) => {
  const ticket = await client.verifyIdToken({
    idToken: req.headers.authorization as string,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) return next(HttpError.unauthorized());

  const user = await db.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) return next(HttpError.unauthorized());

  req.user = {
    id: user.id,
    email: user.email,
  };

  next();
};

export default verify;
