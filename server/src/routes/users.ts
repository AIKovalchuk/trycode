import { Router } from "express";
import { getAllUsersByRoom } from "../controllers/UsersController";

const UsersRouter = Router();

UsersRouter.get("/room/:id/users", getAllUsersByRoom);

export default UsersRouter;
