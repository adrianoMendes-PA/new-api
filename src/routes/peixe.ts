import { Router } from "express";
import { createPeixe } from "../controllers/paixeController";
import { getPeixes } from "../controllers/paixeController";
import { getPeixeById } from "../controllers/paixeController";
import { deletePeixe } from "../controllers/paixeController";
import authUsuario from "../middleware/auth";

const peixeRoutes = Router();

peixeRoutes.post("/createPeixe", authUsuario, createPeixe);
peixeRoutes.get("/getPeixes", authUsuario, getPeixes);
peixeRoutes.get("/:id", authUsuario, getPeixeById);
peixeRoutes.delete("/:id", authUsuario, deletePeixe);

export { peixeRoutes };
