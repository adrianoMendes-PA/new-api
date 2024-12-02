import { Router } from "express";
import { listUsuarios } from "../controllers/usuarioController"; // Corrija o caminho para o arquivo do controlador

const usuarioRoutes = Router();

// Define a rota e associa o controlador
usuarioRoutes.get("/", listUsuarios);

export { usuarioRoutes };
