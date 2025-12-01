import { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { COGNITO_USER_POOL_ID, COGNITO_APP_CLIENT_ID } from "../utils/env";
const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_APP_CLIENT_ID
});
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer ")) return res.status(401).json({ error: "missing token" });
    const token = h.split(" ")[1];
    const payload = await verifier.verify(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token", details: (err as Error).message });
  }
}
