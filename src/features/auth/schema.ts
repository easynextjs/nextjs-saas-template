import { z } from "zod";

export const jwtTokenSchema = z.object({
  accessToken: z.string(),
});

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export const loginResponseSchema = jwtTokenSchema;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerPayloadSchema = loginPayloadSchema.extend({
  name: z.string(),
});
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const registerResponseSchema = jwtTokenSchema;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
