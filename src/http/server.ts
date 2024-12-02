import express, { Request, Response } from "express";
import { prisma } from "./lib/prisma"; // Verifique o caminho correto do seu Prisma
import bcrypt from "bcrypt";

const app = express();

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Rota para criar um novo usuário
app.post("/usuario", async (request: Request, response: Response) => {
  try {
    // Recupera os dados do corpo da requisição
    const { nome, senha, cidade, estado } = request.body as {
      nome: string;
      senha: string;
      cidade: string;
      estado: string;
    };

    // Validação simples
    if (!nome || nome.length > 50) {
      return response.status(400).send({ error: "Nome inválido" });
    }
    if (!senha || senha.length < 6) {
      return response.status(400).send({ error: "Senha muito curta" });
    }
    if (!cidade || cidade.length > 50) {
      return response.status(400).send({ error: "Cidade inválida" });
    }
    if (!estado || estado.length > 50) {
      return response.status(400).send({ error: "Estado inválido" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o usuário no banco de dados com o Prisma
    const usuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        senha: hashedPassword,
        cidade: cidade.trim(),
        estado: estado.toUpperCase(),
      },
    });

    return response.status(201).send({ userId: usuario.id });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return response.status(500).send({ error: "Erro interno do servidor" });
  }
});

// Rota para listar os usuários
app.get("/usuarios", async (request: Request, response: Response) => {
  try {
    // Busca os usuários no banco de dados
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

    return response.status(200).send(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return response.status(500).send({ error: "Erro ao buscar usuários" });
  }
});

// Configura a porta e inicia o servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Exporta a aplicação para o Vercel
export default app;
