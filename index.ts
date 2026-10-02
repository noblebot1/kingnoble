import { drizzle } from "drizzle-orm/netlify-db";
import { netlifyDb } from "@netlify/blobs"; // or Netlify DB driver client
import * as schema from "./schema.js";

export const db = drizzle({ 
  schema,
  casing: "snake_case" // Optional: recommended for auto-mapping camelCase to snake_case DB columns
});

export type DB = typeof db;
