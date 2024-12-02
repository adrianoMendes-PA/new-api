import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE PEIXE
export const createPeixe = async (req: Request, res: Response) => {
  try {
    const { tipoPeixe, quantPeixe, faseCriacao } = req.body;

    if (!tipoPeixe || !quantPeixe || !faseCriacao) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({ error: "Usuário não autenticado." });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuarioExistente) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const peixe = await prisma.peixe.create({
      data: {
        userId,
        tipoPeixe,
        quantPeixe,
        faseCriacao,
      },
    });

    return res.status(201).json({ peixe });
  } catch (error) {
    console.error("Erro ao cadastrar peixe:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Dados duplicados." });
      }
    }

    return res.status(500).json({ error: "Erro interno ao criar peixe." });
  }
};

// LIST PEIXES
export const getPeixes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).send({ error: "Usuário não autenticado" });
    }

    // Buscando os peixes cadastrados pelo usuário
    const peixes = await prisma.peixe.findMany({
      where: {
        userId,
      },
    });

    if (peixes.length === 0) {
      return res.status(404).send({ error: "Nenhum peixe encontrado." });
    }

    return res.status(200).json({ peixes });
  } catch (error) {
    console.error("Erro ao buscar peixes:", error);
    return res.status(500).send({ error: "Erro interno ao buscar peixes" });
  }
};

export const getPeixeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do tanque é obrigatório" });
    }

    const peixe = await prisma.peixe.findUnique({
      where: { id },
    });

    if (!peixe) {
      return res.status(404).json({ error: "Peixe não encontrado" });
    }

    return res.status(200).json(peixe);
  } catch (error) {
    console.error("Erro ao buscar peixe por ID:", error);
    return res.status(500).json({ error: "Erro interno ao buscar peixe" });
  }
};

// DELETE PEIXE
export const deletePeixe = async (req: Request, res: Response) => {
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

    const peixe = await prisma.peixe.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!peixe) {
      return res.status(404).json({ error: "Peixe não encontrado." });
    }

    // Deleta o tanque
    await prisma.peixe.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Peixe deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar peixe:", error);
    return res.status(500).json({ error: "Erro interno ao deletar peixe." });
  }
};
