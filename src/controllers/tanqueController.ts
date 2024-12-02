import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CRIA UM NOVO TANQUE
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

    if (
      !nomeTanque ||
      !largura ||
      !profundidade ||
      !comprimento ||
      !quantPeixe ||
      !tipoPeixe
    ) {
      return res
        .status(400)
        .send({ error: "Todos os campos são obrigatórios" });
    }

    // Extraindo o userId do token (presumindo que o middleware de autenticação já tenha feito isso)
    const userId = req.userId;

    // Se o userId não estiver presente, significa que a autenticação falhou
    if (!userId) {
      return res.status(403).send({ error: "Usuário não autenticado" });
    }

    // Verificando se já existe um tanque com o mesmo nome para o mesmo usuário
    const existingTanque = await prisma.tanque.findFirst({
      where: {
        userId,
        nomeTanque,
      },
    });

    if (existingTanque) {
      return res
        .status(400)
        .send({ error: "Já existe um tanque com esse nome" });
    }

    // Criando o novo tanque
    const tanque = await prisma.tanque.create({
      data: {
        userId,
        nomeTanque,
        largura,
        profundidade,
        comprimento,
        quantPeixe,
        tipoPeixe,
      },
    });

    // Retornando o tanque criado com sucesso
    return res.status(201).json({
      message: "Tanque criado com sucesso!",
      tanque,
    });
  } catch (error) {
    console.error("Erro ao criar tanque:", error);
    return res.status(500).send({ error: "Erro interno ao criar tanque" });
  }
};

// BUSCA TANQUES CADASTRADOS
export const getTanques = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).send({ error: "Usuário não autenticado" });
    }

    // Buscando os tanques cadastrados pelo usuário
    const tanques = await prisma.tanque.findMany({
      where: {
        userId,
      },
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
      return res.status(404).json({ error: "Tanque não encontrado" });
    }

    return res.status(200).json(tanque);
  } catch (error) {
    console.error("Erro ao buscar tanque por ID:", error);
    return res.status(500).json({ error: "Erro interno ao buscar tanque" });
  }
};

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
