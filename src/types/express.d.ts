import { UserAttributes } from '../interfaces/userInterface';

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}
