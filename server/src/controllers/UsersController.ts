import { Request, Response } from "express";
import { getRoomUsers } from "../services/User";

const getAllUsersByRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const users = await getRoomUsers(id);
        res.send({ users });
    } catch (error) {
        res.status(500);
    }
};

export { getAllUsersByRoom };
