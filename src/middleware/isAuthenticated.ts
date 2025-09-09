import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import Role from '../models/roleModel';
import { UserAttributes } from '../interfaces/userInterface';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("-----------------------------------------",authHeader)
  if (!authHeader){
    res.status(401).json({ message: 'Unauthorized access. Please log in first.' });
     return
  } 

  const token = authHeader.split(' ')[1];
  try {
    const decoded:any= jwt.verify(token, process.env.ACCESS_SECRET!);
    const loggedUser=await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }]
    });

    req.user = loggedUser as UserAttributes;
    next();
  } catch {
    res.status(403).json({ status:403,
      message: 'Invalid token please login first '});
  }
};


export const optionalAuth = async(req: Request, res: Response, next: NextFunction) => {
 
  const authHeader = req.headers.authorization;

  if (!authHeader){
    next();
     return
  } 

  const token = authHeader.split(' ')[1];
  try {
    const decoded:any= jwt.verify(token, process.env.ACCESS_SECRET!);
    const loggedUser=await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }]
    });

    req.user = loggedUser as UserAttributes;
    next();
    return
  } catch {
      res.status(403).json({ message: "Forbidden" });
      return
  }


};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}",user)
     if (user.role.role == 'Admin') {
      
     next();
      return
    }
   res.status(403).json({status:403, message: 'Forbidden: Admins only' });
  return
    
};

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  
     if (user.role.role == 'Seller') {
      
     next();
      return
    }
   res.status(403).json({ message: 'Forbidden: Sellers only can register their shops' });
  return
    
};

export const isBuyer = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

     if (user.role.role == 'Buyer') {
     
     next();
      return
    }
   res.status(403).json({ message: 'Forbidden: Sellers only can register their shops' });
  return
    
};


export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // Dummy middleware
  next();
};


export const isAgent = (req: Request, res: Response, next: NextFunction) => {
  // Dummy middleware
  next();
};



