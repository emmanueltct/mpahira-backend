import 'express-serve-static-core';
import { UserAttributes } from '../interfaces/userInterface';

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    rawBody?: string;
  }
}
