import { Router } from "express";
import { ListController } from "@/controllers/list.controller";
import {
  validateBody,
  validateParams,
  listSchemas,
  commonSchemas,
} from "@/middleware/validation.middleware";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();
const listController = new ListController();

router.use(authenticateToken);

router.get("/", listController.getAll);

router.post("/", validateBody(listSchemas.create), listController.create);

router.get("/:id", validateParams(commonSchemas.id), listController.getById);

router.put(
  "/:id",
  validateParams(commonSchemas.id),
  validateBody(listSchemas.update),
  listController.update,
);

router.delete("/:id", validateParams(commonSchemas.id), listController.delete);

router.post(
  "/:id/share",
  validateParams(commonSchemas.id),
  validateBody(listSchemas.share),
  listController.share,
);

router.delete(
  "/:id/share/:userId",
  validateParams(commonSchemas.id),
  listController.unshare,
);

export default router;
