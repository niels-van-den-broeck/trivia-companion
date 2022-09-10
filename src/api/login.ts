import { RequestHandler, Router } from 'express';

import db from '../services/db';
import HttpError from '../services/http-error';
import firebase from '../services/firebase';

const loginCallback: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.idToken) throw HttpError.badRequest();

    const user = await firebase.auth
      .verifyIdToken(req.body.idToken)
      .then(user => user)
      .catch(() => undefined);

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
        firebaseuid: user.sub as string,
        lastLogin: now,
      },
      create: {
        name: user.name || 'John Doe',
        email: user.email as string,
        profilePicture: user.picture as string,
        registeredAt: now,
        firebaseuid: user.sub as string,
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
