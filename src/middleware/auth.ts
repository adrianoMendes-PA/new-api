import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import authConfig from "../config/auth";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function authUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ error: "Token inválido." });
  }

  try {
    const decoded = jwt.verify(
      token,
      authConfig.secret as string
    ) as TokenPayload;

    req.userId = decoded.id;

    return next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).json({ error: "Token inválido." });
  }
}
