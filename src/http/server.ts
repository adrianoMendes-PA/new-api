import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { getUsers } from "./routes/get-users";

const app = fastify();

app.register(createUser);
app.register(getUsers);

if (process.env.NODE_ENV !== "production") {
  app.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running at ${address}`);
  });
}

export default app;
