import { Request } from 'express'

type User = {
  id: string;
  email: string;
}

declare global {
    namespace Express {
      export interface Request {
        user?: User;
      }
    }
}