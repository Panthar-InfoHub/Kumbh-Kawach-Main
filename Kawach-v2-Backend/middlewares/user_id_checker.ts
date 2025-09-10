import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    if (!user_id) {
        res.status(400).json({ message: "user_id is required in the params" });
        return;
    }

    // Check if user_id is a valid firebase uid format
    if (!/^[a-zA-Z0-9]{28}$/.test(user_id)) {
        res.status(400).json({ message: "Invalid user_id format" });
        return;
    }

    next();
}
