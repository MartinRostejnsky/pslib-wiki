CREATE TABLE "folders" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "folderId" varchar(255);