import { Request, Response } from "express";
import { prisma } from "../http/lib/prisma"; // Certifique-se do caminho correto para seu Prisma client
import bcrypt from "bcrypt";
import { z } from "zod"; // Biblioteca de validação

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
