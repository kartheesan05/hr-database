"use server";

import db from "./db";
import { LoginFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/util";
import bcrypt from "bcryptjs";
import { createSession, deleteSession, getSession } from "@/lib/session";

export async function login(state, formData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  try {
    const user = await getUser(email);
    if (!user) {
      return { errors: "invaliduser" };
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      await createSession({
        email: user.email,
        role: user.role,
      });
    } else {
      return { errors: "invaliduser" };
    }
  } catch (error) {
    return { errors: "servererror" };
  }

  redirect("/");
}

export async function logout() {
  deleteSession();
  redirect("/login");
}

export async function getHrData(page = 1, pageSize = 100, searchParams = {}) {
  const session = await getSession();
  if (!session?.email) {
    throw new Error("Unauthorized");
  }

  const offset = (page - 1) * pageSize;
  let query = "SELECT * FROM hr_contacts";
  const queryParams = [];

  const whereConditions = [];
  
  // Role-based filtering
  if (session.role === 'volunteer') {
    whereConditions.push("volunteer_email = $" + (queryParams.length + 1));
    queryParams.push(session.email);
  } else if (session.role === 'incharge') {
    whereConditions.push("incharge_email = $" + (queryParams.length + 1));
    queryParams.push(session.email);
  }
  // Admin gets all records (no additional where clause needed)

  // Search filters
  if (searchParams.name) {
    whereConditions.push("hr_name ILIKE $" + (queryParams.length + 1));
    queryParams.push(`%${searchParams.name}%`);
  }
  if (searchParams.phoneNumber) {
    whereConditions.push("phone_number ILIKE $" + (queryParams.length + 1));
    queryParams.push(`%${searchParams.phoneNumber}%`);
  }
  if (searchParams.email) {
    whereConditions.push("email ILIKE $" + (queryParams.length + 1));
    queryParams.push(`%${searchParams.email}%`);
  }
  if (searchParams.interview) {
    whereConditions.push(
      "LOWER(interview_mode) = LOWER($" + (queryParams.length + 1) + ")"
    );
    queryParams.push(searchParams.interview.toLowerCase());
  }
  if (searchParams.company) {
    whereConditions.push("company ILIKE $" + (queryParams.length + 1));
    queryParams.push(`%${searchParams.company}%`);
  }

  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  const countQuery =
    "SELECT COUNT(*) FROM hr_contacts" +
    (whereConditions.length > 0
      ? " WHERE " + whereConditions.join(" AND ")
      : "");

  query += ` ORDER BY id LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(pageSize, offset);

  try {
    const result = await db.query(query, queryParams);
    const countResult = await db.query(countQuery, queryParams.slice(0, -2));
    const totalCount = parseInt(countResult.rows[0].count);

    return {
      data: result.rows,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
}

export async function addHrRecord(formData) {
  const session = await getSession();
  if (!session?.email) {
    throw new Error("Unauthorized");
  }

  const query = `
    INSERT INTO hr_contacts (
      hr_name,
      phone_number,
      email,
      interview_mode,
      company,
      volunteer,
      incharge,
      status,
      hr_count,
      transport,
      address,
      internship,
      comments,
      incharge_email,
      volunteer_email
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `;

  const values = [
    formData.hr_name,
    formData.phone_number,
    formData.email,
    formData.interview_mode,
    formData.company,
    formData.volunteer,
    formData.incharge,
    formData.status,
    formData.hr_count ? parseInt(formData.hr_count) : 0,
    formData.transport,
    formData.address || "",
    formData.internship || "No",
    formData.comments || "",
    "ed@forese.co.in",
    session.email
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding HR record:", error);
    throw new Error("Failed to add HR record");
  }
}

export async function addUser(state, data) {

  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  if (session.role !== "admin") {
    console.log(session.role);
    return { errors: "Unauthorized" };
  }

  if (!data.email || !data.password || !data.role) {
    console.log(data);
    return { errors: "All fields are required" };
  }

  

  const { email, password, role } = data;
  
  const query = `
    INSERT INTO users (email, password, role) VALUES ($1, $2, $3)
  `;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [email, hashedPassword, role];

    await db.query(query, values);
    return { success: true };
  } catch (error) {
    console.error("Error adding user:", error);
    return { errors: "Server Error" };
  }
}
