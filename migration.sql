CREATE TABLE "products" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"image_key" text,
	"created_at" timestamp DEFAULT now()
);
