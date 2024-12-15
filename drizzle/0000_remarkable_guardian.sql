-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "hr_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"hr_name" varchar(100),
	"volunteer" varchar(100),
	"incharge" varchar(100),
	"company" varchar(100),
	"email" varchar(100),
	"phone_number" varchar(50),
	"status" varchar(20),
	"interview_mode" varchar(20),
	"hr_count" integer,
	"transport" varchar(20),
	"address" text,
	"internship" varchar(3),
	"comments" text,
	"volunteer_email" varchar(100),
	"incharge_email" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(20),
	CONSTRAINT "users_email_key" UNIQUE("email")
);

*/