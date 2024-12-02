import express from "express";
import { listUsuarios } from "./routes/listUsuarios";

const app = express();

app.use(express.json());
app.use("/usuarios", listUsuarios);

// Configura a porta e inicia o servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Exporta a aplicação para o Vercel
export default app;
