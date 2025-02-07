import {NextFunction, Request, Response} from 'express';
import {RequestWithUser} from "./auth";

const permit = (...roles: string[]) => {
    return (expressRequest: Request, res: Response, next: NextFunction) => {
        const req = expressRequest as RequestWithUser;
        if (!req.user) {
            res.status(401).send('Not identified');
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).send('Not authorized');
            return;
        }
        next()
    }
}

export default permit;