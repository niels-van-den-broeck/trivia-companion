import { Router } from 'express';

import registerLoginRoutes from './login';

export default function registerRoutes(router: Router) {
  registerLoginRoutes(router);
}
