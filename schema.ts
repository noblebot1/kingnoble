import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("General"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageKey: text("image_key"),
  createdAt: timestamp("created_at").defaultNow(),
});
