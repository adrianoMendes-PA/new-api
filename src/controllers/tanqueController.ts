import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Função para criar um tanque
 */
export const createTanque = async (req: Request, res: Response) => {
  try {
    const {
      nomeTanque,
      largura,
      profundidade,
      comprimento,
      quantPeixe,
      tipoPeixe,
    } = req.body;
    // Validar userId do token
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ error: "Usuário não autenticado." });
    }

    // Validar existência do usuário
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuarioExistente) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    // Criar tanque
    const tanque = await prisma.tanque.create({
      data: {
        userId,
        nomeTanque: nomeTanque || null,
        largura,
        profundidade,
        comprimento,
        quantPeixe: quantPeixe || null,
        tipoPeixe,
      },
    });

    return res.status(201).json({ tanque });
  } catch (error) {
    console.error("Erro ao criar tanque:", error);
    return res.status(500).json({ error: "Erro interno ao criar tanque." });
  }
};

// BUSCA TANQUES CADASTRADOS
export const getTanques = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).send({ error: "Usuário não autenticado" });
    }

    const tanques = await prisma.tanque.findMany({
      where: {
        userId,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    // Se não houver tanques cadastrados
    if (tanques.length === 0) {
      return res.status(404).send({ error: "Nenhum tanque encontrado." });
    }

    // Retornando os tanques encontrados
    return res.status(200).json({
      message: "Tanques encontrados com sucesso!",
      tanques,
    });
  } catch (error) {
    console.error("Erro ao buscar tanques:", error);
    return res.status(500).send({ error: "Erro interno ao buscar tanques" });
  }
};

// LISTA O TOTAL DE TANQUES CADASTRADOS PELO USUÁRIO
export const totalTanques = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).send({ error: "Usuário não autenticado" });
    }

    const tanques = await prisma.tanque.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        id: "desc",
      },
    });
    const count = await prisma.tanque.count({
      where: {
        userId: req.userId,
      },
    });
    res.header("x-total-count", count.toString());
    return res.json(tanques);
  } catch (error) {
    console.error("Erro ao totalizar tanques:", error);
    return res.status(500).send({ error: "Erro interno ao totalizar tanques" });
  }
};

// BUSCA UM TANQUE PELO ID
export const getTanqueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do tanque é obrigatório" });
    }

    const tanque = await prisma.tanque.findUnique({
      where: { id },
    });

    if (!tanque) {
      return res.status(404).json({ error: "Tanque não encontrado..." });
    }

    return res.status(200).json(tanque);
  } catch (error) {
    console.error("Erro ao buscar tanque por ID:", error);
    return res.status(500).json({ error: "Erro interno ao buscar tanque" });
  }
};

// DELETE TANQUE
export const deleteTanque = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verifica se o ID foi fornecido
    if (!id) {
      return res.status(400).json({ error: "ID do tanque é obrigatório." });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ error: "Usuário não autenticado." });
    }

    // Verifica se o tanque pertence ao usuário autenticado
    const tanque = await prisma.tanque.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!tanque) {
      return res.status(404).json({ error: "Tanque não encontrado." });
    }

    // Deleta o tanque
    await prisma.tanque.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Tanque deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar tanque:", error);
    return res.status(500).json({ error: "Erro interno ao deletar tanque." });
  }
};
