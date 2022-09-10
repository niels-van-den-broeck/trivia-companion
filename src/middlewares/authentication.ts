import { RequestHandler } from 'express';
import db from '../services/db';
import firebase from '../services/firebase';
import HttpError from '../services/http-error';

const verify: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization) return next(HttpError.unauthorized());

  const payload = await firebase.auth
    .verifyIdToken(req.headers.authorization)
    .then(user => user)
    .catch(() => undefined);

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
