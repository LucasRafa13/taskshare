import { Router } from "express";
import { TaskController } from "@/controllers/task.controller";
import {
  validateBody,
  validateParams,
  taskSchemas,
  commonSchemas,
} from "@/middleware/validation.middleware";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();
const taskController = new TaskController();

router.use(authenticateToken);

router.get(
  "/task/:id",
  validateParams(commonSchemas.id),
  taskController.getById,
);

router.put(
  "/task/:id",
  validateParams(commonSchemas.id),
  validateBody(taskSchemas.update),
  taskController.update,
);

router.patch(
  "/task/:id/toggle",
  validateParams(commonSchemas.id),
  taskController.toggle,
);

router.delete(
  "/task/:id",
  validateParams(commonSchemas.id),
  taskController.delete,
);

router.get(
  "/list/:listId/tasks",
  validateParams(commonSchemas.listId),
  taskController.getByListId,
);

router.post(
  "/list/:listId/tasks",
  validateParams(commonSchemas.listId),
  validateBody(taskSchemas.create),
  taskController.create,
);

router.patch(
  "/list/:listId/reorder",
  validateParams(commonSchemas.listId),
  taskController.reorder,
);

export default router;
 