import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserRole } from '@lootupspace/shared';

export interface AuthenticatedUser {
  id: string;
  phone: string;
  email?: string | null;
  name?: string | null;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.lootup_token) {
    token = req.cookies.lootup_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid Bearer token.'
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token.'
    });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' does not have access to this resource. Allowed: ${allowedRoles.join(', ')}`
      });
    }

    return next();
  };
}

