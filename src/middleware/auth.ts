import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

require("dotenv/config");

import authConfig from "../config/auth";

interface TokenPayload {
  id: string;
  iat: string;
  exp: string;
}

export default function authUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  console.log("Authorization Header:", authorization);

  if (!authorization) {
    return res.status(401).json({ error: "Token não existe." });
  }

  // Extração do token
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null;

  console.log("Token capturado:", token);

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido." });
  }

  try {
    const data = jwt.verify(token, authConfig.secret);
    console.log(data);
    const { id } = data as unknown as TokenPayload;

    req.userId = id;

    return next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return res.status(401).json({ error: "Token inválido." });
  }
}
