import express from "express";
import { usuarioRoutes } from "../routes/usuario";

const app = express();

app.use(express.json());

// Usa o middleware de rotas
app.use("/usuario", usuarioRoutes);

// Configura a porta e inicia o servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Exporta a aplicação para o Vercel
export default app;
