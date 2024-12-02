import { Router } from "express";
import { listUsuarios } from "../controllers/usuarioController";
import { createUsuario } from "../controllers/usuarioController";
import { loginUsuario } from "../controllers/usuarioController";

const usuarioRoutes = Router();

// Define a rota e associa o controlador
usuarioRoutes.get("/list", listUsuarios);
usuarioRoutes.post("/create", createUsuario);

// Rota para login
usuarioRoutes.post("/login", loginUsuario);

export { usuarioRoutes };
