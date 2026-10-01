import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull().default(""),
  category: text().notNull().default("General"),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  imageKey: text("image_key"),
  createdAt: timestamp("created_at").defaultNow(),
});
