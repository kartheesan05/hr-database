"use server";

import db from "./db";
import { LoginFormSchema, AddUserSchema, HrContactSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/util";
import bcrypt from "bcryptjs";
import { createSession, deleteSession, getSession } from "@/lib/session";

export async function login(formData) {
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
  let role = null;

  try {
    const user = await getUser(email);
    if (!user) {
      return { errors: "invaliduser" };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return { errors: "invaliduser" };
    }

    await createSession({
      email: user.email,
      role: user.role,
    });
    role = user.role;
  } catch (error) {
    return { errors: "servererror" };
  }
  console.log("redirecting");
  return { role: role };
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
  if (searchParams.search) {
    whereConditions.push(`(
    hr_name ILIKE $${queryParams.length + 1} OR
    phone_number ILIKE $${queryParams.length + 1} OR
    email ILIKE $${queryParams.length + 1} OR
    company ILIKE $${queryParams.length + 1} OR
    volunteer ILIKE $${queryParams.length + 1} OR
    incharge ILIKE $${queryParams.length + 1} OR
    status ILIKE $${queryParams.length + 1} OR
    interview_mode ILIKE $${queryParams.length + 1} OR
    transport ILIKE $${queryParams.length + 1}
  )`);
    queryParams.push(`%${searchParams.search}%`);
  }
  if (searchParams.interview) {
    whereConditions.push(
      "LOWER(interview_mode) = LOWER($" + (queryParams.length + 1) + ")"
    );
    queryParams.push(searchParams.interview.toLowerCase());
  }

  if (searchParams.status) {
    whereConditions.push("status = $" + (queryParams.length + 1));
    queryParams.push(searchParams.status);
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
    return { errors: "Unauthorized" };
  }

  // Add schema validation
  const validatedFields = HrContactSchema.safeParse({
    hr_name: formData.hr_name,
    phone_number: formData.phone_number,
    email: formData.email,
    interview_mode: formData.interview_mode,
    company: formData.company,
    volunteer: formData.volunteer,
    incharge: formData.incharge,
    status: formData.status,
    hr_count: formData.hr_count ? parseInt(formData.hr_count) : 1,
    transport: formData.transport,
    address: formData.address,
    internship: formData.internship || "No",
    comments: formData.comments
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const validatedData = validatedFields.data;
  
  const query = `
    INSERT INTO hr_contacts (
      hr_name, phone_number, email, interview_mode, company,
      volunteer, incharge, status, hr_count, transport,
      address, internship, comments, incharge_email, volunteer_email
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `;

  const values = [
    validatedData.hr_name,
    validatedData.phone_number,
    validatedData.email,
    validatedData.interview_mode,
    validatedData.company,
    validatedData.volunteer,
    validatedData.incharge,
    validatedData.status,
    validatedData.hr_count,
    validatedData.transport,
    validatedData.address,
    validatedData.internship,
    validatedData.comments,
    "ed@forese.co.in",
    session.email,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding HR record:", error);
    return { errors: "Failed to add HR record" };
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

  // Only fetch incharges
  const inchargesQuery = `
    SELECT email FROM users WHERE role = 'incharge'
  `;

  try {
    const [hrResult, inchargesResult] = await Promise.all([
      db.query(query, [id]),
      db.query(inchargesQuery)
    ]);

    if (hrResult.rows.length === 0) {
      return { errors: "HR record not found" };
    }

    const hrRecord = hrResult.rows[0];

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
      return { 
        data: filteredRecord,
        incharges: [] // Volunteers can't see incharges
      };
    }

    return { 
      data: hrRecord,
      incharges: inchargesResult.rows.map(i => i.email)
    };
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

  // Add schema validation
  const validatedFields = HrContactSchema.safeParse({
    hr_name: formData.hr_name,
    phone_number: formData.phone_number,
    email: formData.email,
    interview_mode: formData.interview_mode,
    company: formData.company,
    volunteer: formData.volunteer,
    incharge: formData.incharge,
    status: formData.status,
    hr_count: formData.hr_count ? parseInt(formData.hr_count) : 1,
    transport: formData.transport,
    address: formData.address,
    internship: formData.internship || "No",
    comments: formData.comments
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const validatedData = validatedFields.data;

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
      validatedData.hr_name,
      validatedData.phone_number,
      validatedData.email,
      validatedData.interview_mode,
      validatedData.company,
      validatedData.volunteer,
      validatedData.incharge,
      validatedData.status,
      validatedData.hr_count,
      validatedData.transport,
      validatedData.address,
      validatedData.internship,
      validatedData.comments,
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

export async function deleteHR(id) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  // First check if the user has permission to delete this record
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
      return { errors: "Unauthorized - You can only delete your own records" };
    }

    if (session.role === 'incharge' && hrRecord.incharge_email !== session.email) {
      return { errors: "Unauthorized - You can only delete records assigned to you" };
    }

    const deleteQuery = `
      DELETE FROM hr_contacts WHERE id = $1
    `;

    await db.query(deleteQuery, [id]);
    return { success: true };
  } catch (error) {
    console.error("Error deleting HR record:", error);
    return { errors: "Failed to delete HR record" };
  }
}
