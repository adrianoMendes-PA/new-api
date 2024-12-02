import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { getUsers } from "./routes/get-users";

const app = fastify();

app.register(createUser);
app.register(getUsers);

// Remova a parte do listen, pois o Vercel gerencia a inicialização do servidor.
export default app;
