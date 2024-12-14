import { pgTable, serial, varchar, integer, text, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const hrContacts = pgTable("hr_contacts", {
	id: serial().primaryKey().notNull(),
	hrName: varchar("hr_name", { length: 100 }),
	volunteer: varchar({ length: 100 }),
	incharge: varchar({ length: 100 }),
	company: varchar({ length: 100 }),
	email: varchar({ length: 100 }),
	phoneNumber: varchar("phone_number", { length: 50 }),
	status: varchar({ length: 20 }),
	interviewMode: varchar("interview_mode", { length: 20 }),
	hrCount: integer("hr_count"),
	transport: varchar({ length: 20 }),
	address: text(),
	internship: varchar({ length: 3 }),
	comments: text(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);
