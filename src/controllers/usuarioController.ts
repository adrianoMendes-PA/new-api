import { Request, Response } from "express";
import { prisma } from "../http/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Função de login e geração de token
export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, senha } = req.body;

    // Validações
    if (!nome || !senha) {
      return res.status(400).send({ error: "Nome e senha são obrigatórios" });
    }

    // Buscando usuário no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { nome },
    });

    if (!usuario) {
      return res.status(404).send({ error: "Usuário não encontrado" });
    }

    // Verificando a senha fornecida
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).send({ error: "Senha inválida" });
    }

    // Gerando o token JWT
    const payload = { id: usuario.id, nome: usuario.nome };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "24h",
    });

    // Retornando o token e os dados do usuário
    return res.status(200).json({
      user: {
        id: usuario.id,
        nome: usuario.nome,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
};

const usuarioSchema = z.object({
  nome: z.string().min(1).max(50),
  senha: z.string().max(20),
  cidade: z.string().min(1).max(50),
  estado: z.string().min(2).max(20).toUpperCase(),
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

    // Retorna uma resposta bem-sucedida com dados do usuário
    return res.status(201).send({
      message: "Usuário criado com sucesso!",
      userId: usuario.id,
      nome: usuario.nome,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      // Erro de validação com Zod
      return res
        .status(400)
        .send({ error: "Dados inválidos", details: error.errors });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).send({ error: "Usuário já existe." });
      }
    }

    // Erro de conexão com o banco de dados ou erro inesperado
    console.error("Erro inesperado:", error);
    return res.status(500).send({ error: "Erro interno do servidor" });
  }
};
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
