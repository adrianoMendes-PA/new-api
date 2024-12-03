import { Router } from "express";
import { createTanque } from "../controllers/tanqueController";
import { getTanques } from "../controllers/tanqueController";
import { totalTanques } from "../controllers/tanqueController";
import { getTanqueById } from "../controllers/tanqueController";
import { deleteTanque } from "../controllers/tanqueController";
import authUsuario from "../middleware/auth";

const tanqueRoutes = Router();

tanqueRoutes.post("/createTanque", authUsuario, createTanque);
tanqueRoutes.get("/getTanques", authUsuario, getTanques);
tanqueRoutes.get("/totalTanques", authUsuario, totalTanques);
tanqueRoutes.get("/:id([0-9a-fA-F-]{36})", authUsuario, getTanqueById);
tanqueRoutes.delete("/:id", authUsuario, deleteTanque);

export { tanqueRoutes };
