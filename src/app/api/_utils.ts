import "server-only";

import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: number;
  email: string;
};

export function decodeAuthToken(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key"
  ) as JwtPayload;

  return decoded;
}

export function createAuthToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "1d",
  });
}
