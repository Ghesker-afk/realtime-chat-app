import 'dotenv/config';
import { z } from 'zod';

// to validate data, you must first define a schema. Schemas
// represent types, from simple primitive values to complex
// nested objects and arrays.

// every time that we are going to add a new env config, we'll
// add the config here with the correct type.

const EnvSchema = z.object({
  PORT: z.string().default("5000"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("6450"),
  DB_NAME: z.string().default("realtime_chat_and_threads_app"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres")
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  process.exit(1);
}

export const env = parsedEnv.data;