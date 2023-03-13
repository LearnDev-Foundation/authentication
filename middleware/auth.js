import jwt from "jsonwebtoken";
import { jwtSecret } from '../config.js';

export default async function Auth(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = await jwt.verify(token, jwtSecret);

    req.user = decodedToken;

    next();
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next();
}