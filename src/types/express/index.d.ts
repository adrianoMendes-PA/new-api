// src/types/express/index.d.ts

import { Request } from "express";

// Extender a interface Request do Express
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Ou o tipo que você usa para o userId
    }
  }
}
