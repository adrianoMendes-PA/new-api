import { FastifyInstance } from "fastify";
import { prisma } from "../src/http/lib/prisma";

export async function getUsers(app: FastifyInstance) {
  app.get("/usuarios", async (request, reply) => {
    try {
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
      return reply.status(200).send(usuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return reply.status(500).send({ error: "Erro ao buscar usuários" });
    }
  });
}
