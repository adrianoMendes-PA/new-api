import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { getUsers } from "./routes/get-users";

const app = fastify();

app.register(createUser);
app.register(getUsers);

app.listen({ port: 8080 }).then(() => {
  console.log("Server is running");
});
