import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any;
}

// Middleware para verificar o token JWT
export const verifyToken = (
  req: CustomRequest, // Usando o tipo CustomRequest aqui
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ error: "Token de autenticação ausente" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.user = decoded;
    next(); // Chama o próximo middleware ou rota
  } catch (error) {
    return res.status(401).send({ error: "Token inválido" });
  }
};
