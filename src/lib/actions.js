"use server";

import db from "./db";
import { LoginFormSchema, AddUserSchema } from "@/lib/definitions";
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
    console.log(validatedFields.error.flatten().fieldErrors);
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

    if (!validPassword) {
      return { errors: "invaliduser" };
    }

    // Only create session and redirect if password is valid
    await createSession({
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("server error");
    console.log(error);
    return { errors: "servererror" };
  }
  console.log("redirecting");
  redirect("/");
}

export async function logout() {
  deleteSession();
  redirect("/auth/login");
}

export async function getHrData(page = 1, pageSize = 100, searchParams = {}) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  const offset = (page - 1) * pageSize;
  let query = "SELECT * FROM hr_contacts";
  const queryParams = [];

  const whereConditions = [];

  // Role-based filtering
  if (session.role === "volunteer") {
    whereConditions.push("volunteer_email = $" + (queryParams.length + 1));
    queryParams.push(session.email);
  } else if (session.role === "incharge") {
    whereConditions.push("incharge_email = $" + (queryParams.length + 1));
    queryParams.push(session.email);
  } else if (session.role !== "admin") {
    return { errors: "Unauthorized" };
  }

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
    session.email,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding HR record:", error);
    throw new Error("Failed to add HR record");
  }
}

export async function addUser(state, formData) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  if (session.role !== "admin") {
    return { errors: "Unauthorized" };
  }

  const validatedFields = AddUserSchema.safeParse({
    email: formData.email,
    password: formData.password,
    role: formData.role,
  });

  const inchargeEmail = formData.inchargeEmail;

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, role } = validatedFields.data;

  // If role is volunteer, verify that the incharge exists
  if (role === 'volunteer') {
    console.log("inchargeEmail", inchargeEmail);
    const inchargeQuery = 'SELECT * FROM users WHERE email = $1 AND role = $2';
    const inchargeResult = await db.query(inchargeQuery, [inchargeEmail, 'incharge']);
    
    if (inchargeResult.rows.length === 0) {
      // console.log("inchargeResult", inchargeResult);
      return { errors: "Specified incharge email does not exist or is not an incharge" };
    }
  }

  const query = `
    INSERT INTO users (email, password, role, incharge_email) 
    VALUES ($1, $2, $3, $4)
  `;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [
      email, 
      hashedPassword, 
      role, 
      role === 'volunteer' ? inchargeEmail : null
    ];

    await db.query(query, values);
    return { success: true };
  } catch (error) {
    console.error("Error adding user:", error);
    return { errors: "Server Error" };
  }
}

export async function getHR(id) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  const query = `
    SELECT * FROM hr_contacts WHERE id = $1
  `;

  try {
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return { errors: "HR record not found" };
    }

    const hrRecord = result.rows[0];

    // Check permissions based on role
    if (
      session.role === "volunteer" &&
      hrRecord.volunteer_email !== session.email
    ) {
      return { errors: "Unauthorized - You can only view your own records" };
    }

    if (
      session.role === "incharge" &&
      hrRecord.incharge_email !== session.email
    ) {
      return {
        errors: "Unauthorized - You can only view records assigned to you",
      };
    }

    if (session.role === 'volunteer') {
      const { volunteer_email, incharge_email, ...filteredRecord } = hrRecord;
      return { data: filteredRecord };
    }
    return { data: hrRecord };
  } catch (error) {
    console.error("Error fetching HR record:", error);
    return { errors: "Server Error" };
  }
}

export async function editHR(id, formData) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  // First check if the user has permission to edit this record
  const checkQuery = `
    SELECT * FROM hr_contacts WHERE id = $1
  `;

  try {
    const checkResult = await db.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
      return { errors: "HR record not found" };
    }

    const hrRecord = checkResult.rows[0];

    // Check permissions based on role
    if (session.role === 'volunteer' && hrRecord.volunteer_email !== session.email) {
      return { errors: "Unauthorized - You can only edit your own records" };
    }

    if (session.role === 'incharge' && hrRecord.incharge_email !== session.email) {
      return { errors: "Unauthorized - You can only edit records assigned to you" };
    }

    // Admin can edit all records, so no additional check needed for admin role

    const query = `
  UPDATE hr_contacts SET
    hr_name = $1,
    phone_number = $2,
    email = $3,
    interview_mode = $4,
    company = $5,
    volunteer = $6,
    incharge = $7,
    status = $8,
    hr_count = $9,
    transport = $10,
    address = $11,
    internship = $12,
    comments = $13,
    volunteer_email = COALESCE($14, volunteer_email),
    incharge_email = COALESCE($15, incharge_email)
  WHERE id = $16
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
      formData.volunteer_email,
      formData.incharge_email,
      id,
    ];

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return { errors: "HR record not found" };
    }
    return { data: result.rows[0] };
  } catch (error) {
    console.error("Error updating HR record:", error);
    return { errors: "Failed to update HR record" };
  }
}
