import { Router } from "express";
import { CommentController } from "@/controllers/comment.controller";
import {
  validateBody,
  validateParams,
  commonSchemas,
} from "@/middleware/validation.middleware";
import { authenticateToken } from "@/middleware/auth.middleware";
import Joi from "joi";

const router = Router();
const commentController = new CommentController();

router.use(authenticateToken);

const commentSchemas = {
  create: Joi.object({
    content: Joi.string().min(1).max(2000).required(),
  }),

  update: Joi.object({
    content: Joi.string().min(1).max(2000).required(),
  }),
};

const taskIdSchema = Joi.object({
  taskId: Joi.string().required(),
});

router.get(
  "/task/:taskId/comments",
  validateParams(taskIdSchema),
  commentController.getByTaskId,
);

router.post(
  "/task/:taskId/comments",
  validateParams(taskIdSchema),
  validateBody(commentSchemas.create),
  commentController.create,
);

router.put(
  "/comment/:id",
  validateParams(commonSchemas.id),
  validateBody(commentSchemas.update),
  commentController.update,
);

router.delete(
  "/comment/:id",
  validateParams(commonSchemas.id),
  commentController.delete,
);

export default router;
