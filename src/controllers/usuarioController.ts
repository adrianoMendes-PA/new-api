import { Request, Response } from "express";
import { prisma } from "../http/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod"; // Certifique-se do caminho correto para seu Prisma client
import { Prisma } from "@prisma/client";

// Controlador para listar usuários
export const listUsuarios = async (req: Request, res: Response) => {
  try {
    // Buscar usuários no banco de dados
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        cidade: true,
        estado: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).send(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).send({ error: "Erro ao buscar usuários" });
  }
};

// Schema de validação com mensagens personalizadas
const usuarioSchema = z.object({
  nome: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(50, "O nome deve ter no máximo 50 caracteres."),
  senha: z.string().max(20),
  cidade: z
    .string()
    .min(1, "A cidade é obrigatória.")
    .max(50, "A cidade deve ter no máximo 50 caracteres."),
  estado: z
    .string()
    .min(2, "O estado deve ter 2 caracteres.")
    .max(10, "O estado deve ter 2 caracteres.")
    .transform((value) => value.toUpperCase()),
});

// Controlador para criar um novo usuário
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, senha, cidade, estado } = usuarioSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        senha: hashedPassword,
        cidade: cidade.trim(),
        estado,
      },
    });

    return res
      .status(201)
      .send({ message: "Usuário criado com sucesso!", userId: usuario.id });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).send({ error: "Usuário já existe." });
      }
    } else {
      console.error("Erro inesperado:", error);
      return res.status(500).send({ error: "Erro interno do servidor" });
    }
  }
};
