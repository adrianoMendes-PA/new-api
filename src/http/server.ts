import fastify from "fastify";
import { createUser } from "./routes/create-user";

const app = fastify();

app.register(createUser);

app.listen({ port: 8080 }).then(() => {
  console.log("Server is running");
});
