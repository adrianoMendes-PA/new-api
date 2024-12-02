import { Request, Response } from "express";
import { prisma } from "../http/lib/prisma"; // Certifique-se do caminho correto para seu Prisma client
import bcrypt from "bcrypt";
import { z } from "zod"; // Biblioteca de validação

// Schema de validação com Zod
const usuarioSchema = z.object({
  nome: z.string().min(1).max(50),
  senha: z.string().min(6),
  cidade: z.string().min(1).max(50),
  estado: z.string().min(2).max(2).toUpperCase(),
});

// Controlador para criar um novo usuário
export const createUsuario = async (req: Request, res: Response) => {
  try {
    // Validação do corpo da requisição
    const { nome, senha, cidade, estado } = usuarioSchema.parse(req.body);

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar o usuário no banco de dados
    const usuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        senha: hashedPassword,
        cidade: cidade.trim(),
        estado: estado.toUpperCase(),
      },
    });

    return res.status(201).send({ userId: usuario.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .send({ error: "Dados inválidos", details: error.errors });
    }
    console.error("Erro ao criar usuário:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
};
