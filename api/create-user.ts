import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../src/http/lib/prisma";
import { Prisma } from "@prisma/client";

export function createUser(app: FastifyInstance) {
  app.post("/usuario", async (request, reply) => {
    try {
      const createUserBody = z.object({
        nome: z
          .string()
          .min(1, "Nome é obrigatório")
          .max(50, "Nome muito longo"),
        senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
        cidade: z.string().min(1, "Cidade é obrigatória").max(50),
        estado: z.string().min(2, "Estado deve ter 2 caracteres").max(50),
      });

      const { nome, senha, cidade, estado } = createUserBody.parse(
        request.body
      );

      const hashedPassword = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome: nome.trim(),
          senha: hashedPassword,
          cidade: cidade.trim(),
          estado: estado.toUpperCase(),
        },
      });

      return reply.status(201).send({ userId: usuario.id });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return reply.status(409).send({ error: "Usuário já existe" });
        }
      }

      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }

      console.error(error);
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
  });
}
