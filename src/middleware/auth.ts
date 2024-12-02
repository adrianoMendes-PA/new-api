import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

require("dotenv/config");

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
    return res.status(401).json({ error: "Token não existe." });
  }

  // Extração do token
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido." });
  }

  // Verificação se o secret está configurado
  if (!authConfig.secret) {
    console.error("Erro: JWT_SECRET_KEY não configurado.");
    return res.status(500).json({ error: "Erro de configuração interna." });
  }

  try {
    const data = jwt.verify(token, authConfig.secret);
    console.log(data);

    const { id } = data as TokenPayload;

    req.userId = id;

    return next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return res.status(401).json({ error: "Token inválido." });
  }
}
