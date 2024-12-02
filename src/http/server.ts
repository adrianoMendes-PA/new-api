import fastify from "fastify";
import { createUser } from "../../api/create-user";
import { getUsers } from "../../api/get-users";

const app = fastify();

app.register(createUser);
app.register(getUsers);

// Remova a parte do listen, pois o Vercel gerencia a inicialização do servidor.
export default app;
