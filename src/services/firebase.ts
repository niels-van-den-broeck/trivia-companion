import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseapp = initializeApp({
  credential: applicationDefault(),
});

export default {
  app: firebaseapp,
  auth: getAuth(),
};
