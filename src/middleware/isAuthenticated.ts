import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader){
    res.status(401).json({ msg: 'Token missing' });
     return
  } 

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ msg: 'Invalid token' });
  }
};

