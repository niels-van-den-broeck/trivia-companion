import { RequestHandler, Router } from 'express';

import { OAuth2Client } from 'google-auth-library';
import db from '../services/db';
import HttpError from '../services/http-error';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginCallback: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.idToken) throw new Error();

    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user = ticket.getPayload();

    if (!user) throw HttpError.unauthorized();

    const now = new Date();

    const dbUser = await db.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name || 'John Doe',
        email: user.email as string,
        profilePicture: user.picture as string,
        lastLogin: now,
      },
      create: {
        name: user.name || 'John Doe',
        email: user.email as string,
        profilePicture: user.picture as string,
        registeredAt: now,
        lastLogin: now,
      },
    });

    return res.json(dbUser);
  } catch (e) {
    next(e);
  }
};

export default function registerRoutes(router: Router) {
  router.post('/login-callback', loginCallback);
}
