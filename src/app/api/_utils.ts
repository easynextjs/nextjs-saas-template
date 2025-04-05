import "server-only";

import jwt from "jsonwebtoken";

export function decodeAuthToken(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key"
  );
  return decoded;
}

export function createAuthToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "1d",
  });
}
