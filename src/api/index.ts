import { Router } from 'express';

import registerLoginRoutes from './login';
import registerQuizRoutes from './quiz';

export default function registerRoutes(router: Router) {
  registerLoginRoutes(router);
  registerQuizRoutes(router);
}
