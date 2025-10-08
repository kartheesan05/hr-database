"use server";

import db from "./db";
import {
  LoginFormSchema,
  AddUserSchema,
  HrContactSchema,
} from "@/lib/definitions";
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  let role = null;
  let user_name = null;
  let incharge_name = null;
  let incharge_email = null;

  try {
    const user = await getUser(email);
    if (!user) {
      return { errors: "invaliduser" };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return { errors: "invaliduser" };
    }

    if (user.role === "volunteer") {
      const incharge = await getUser(user.incharge_email);
      incharge_name = incharge.name;
      incharge_email = incharge.email;
      await createSession({
        email: user.email,
        role: user.role,
        name: user.name,
        incharge_email: incharge.email,
        incharge_name: incharge.name,
      });
    } else {
      await createSession({
        email: user.email,
        role: user.role,
        name: user.name,
      });
    }

    role = user.role;
    user_name = user.name;
  } catch (error) {
    return { errors: "servererror" };
  }
  return { role: role, name: user_name, incharge: incharge_name };
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
  let query = `
    SELECT
      h.id,
      h.hr_name,
      h.phone_number,
      h.email,
      h.company,
      h.status,
      h.interview_mode,
      h.hr_count,
      h.transport,
      h.address,
      h.internship,
      h.comments,
      h.volunteer_email,
      uv.incharge_email AS incharge_email,
      uv.name AS volunteer,
      ui.name AS incharge
    FROM hr_contacts h
    LEFT JOIN users uv ON uv.email = h.volunteer_email
    LEFT JOIN users ui ON ui.email = uv.incharge_email
  `;
  const queryParams = [];

  const whereConditions = [];

  // Role-based filtering
  if (session.role === "volunteer") {
    whereConditions.push("h.volunteer_email = $" + (queryParams.length + 1));
    queryParams.push(session.email);
  } else if (session.role === "incharge") {
    whereConditions.push("uv.incharge_email = $" + (queryParams.length + 1));
    queryParams.push(session.email);
  } else if (session.role !== "admin" && session.role !== "global") {
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
    h.hr_name ILIKE $${queryParams.length + 1} OR
    h.phone_number ILIKE $${queryParams.length + 1} OR
    h.email ILIKE $${queryParams.length + 1} OR
    h.company ILIKE $${queryParams.length + 1} OR
    uv.name ILIKE $${queryParams.length + 1} OR
    ui.name ILIKE $${queryParams.length + 1} OR
    h.status ILIKE $${queryParams.length + 1} OR
    h.interview_mode ILIKE $${queryParams.length + 1} OR
    h.transport ILIKE $${queryParams.length + 1}
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

  const countQuery = `
    SELECT COUNT(*)
    FROM hr_contacts h
    LEFT JOIN users uv ON uv.email = h.volunteer_email
    LEFT JOIN users ui ON ui.email = uv.incharge_email
    ${whereConditions.length > 0 ? " WHERE " + whereConditions.join(" AND ") : ""}
  `;

  query += ` ORDER BY h.id LIMIT $${queryParams.length + 1} OFFSET $${
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
    comments: formData.comments,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // Validate volunteer assignment per role against new schema
  if (
    session.role === "incharge" &&
    (!formData.volunteer_email || !formData.volunteer_email.includes("@"))
  ) {
    return {
      errors: "A valid volunteer email is required",
    };
  }

  if (session.role === "admin" && (!formData.volunteer_email || !formData.volunteer_email.includes("@"))) {
    return {
      errors: "A valid volunteer email is required",
    };
  }

  const validatedData = validatedFields.data;

  // Determine volunteer_email based on role and validate
  let volunteerEmailToUse = session.email;
  if (session.role === "volunteer") {
    volunteerEmailToUse = session.email;
  } else if (session.role === "incharge") {
    // ensure provided volunteer belongs to this incharge
    const checkVolunteer = await db.query(
      "SELECT 1 FROM users WHERE email = $1 AND role = 'volunteer' AND incharge_email = $2",
      [formData.volunteer_email, session.email]
    );
    if (checkVolunteer.rows.length === 0) {
      return { errors: "Specified volunteer is not assigned to you" };
    }
    volunteerEmailToUse = formData.volunteer_email;
  } else if (session.role === "admin") {
    const checkVolunteer = await db.query(
      "SELECT 1 FROM users WHERE email = $1 AND role = 'volunteer'",
      [formData.volunteer_email]
    );
    if (checkVolunteer.rows.length === 0) {
      return { errors: "Specified volunteer email does not exist" };
    }
    volunteerEmailToUse = formData.volunteer_email;
  }

  const query = `
    WITH inserted AS (
      INSERT INTO hr_contacts (
        hr_name, volunteer_email, phone_number, email, company,
        status, interview_mode, hr_count, transport, address,
        internship, comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    )
    SELECT i.*, uv.incharge_email AS incharge_email, uv.name AS volunteer, ui.name AS incharge
    FROM inserted i
    JOIN users uv ON uv.email = i.volunteer_email
    LEFT JOIN users ui ON ui.email = uv.incharge_email
  `;

  const values = [
    validatedData.hr_name,
    volunteerEmailToUse,
    validatedData.phone_number,
    validatedData.email,
    validatedData.company,
    validatedData.status,
    validatedData.interview_mode,
    validatedData.hr_count,
    validatedData.transport,
    validatedData.address,
    validatedData.internship,
    validatedData.comments,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding HR record:", error);
    // Check for unique constraint violation
    if (error.code === "23505" && error.constraint === "unique_phone_number") {
      return {
        errors:
          "Phone number already exists in the database. Duplicate entries are not allowed.",
      };
    }
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
    name: formData.name,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const inchargeEmail = formData.inchargeEmail;

  const { email, password, role, name } = validatedFields.data;

  // If role is volunteer, verify that the incharge exists
  if (role === "volunteer") {
    const inchargeQuery = "SELECT * FROM users WHERE email = $1 AND role = $2";
    const inchargeResult = await db.query(inchargeQuery, [
      inchargeEmail,
      "incharge",
    ]);

    if (inchargeResult.rows.length === 0) {
      return {
        errors: "Specified incharge email does not exist or is not an incharge",
      };
    }
  }

  const query = `
    INSERT INTO users (email, password, role, incharge_email, name) 
    VALUES ($1, $2, $3, $4, $5)
  `;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [
      email,
      hashedPassword,
      role,
      role === "volunteer" ? inchargeEmail : null,
      name,
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
    SELECT 
      h.*, 
      uv.incharge_email AS incharge_email,
      uv.name AS volunteer,
      ui.name AS incharge
    FROM hr_contacts h
    LEFT JOIN users uv ON uv.email = h.volunteer_email
    LEFT JOIN users ui ON ui.email = uv.incharge_email
    WHERE h.id = $1
  `;

  // Only fetch incharges
  const inchargesQuery = `
    SELECT email FROM users WHERE role = 'incharge'
  `;

  try {
    const [hrResult, inchargesResult] = await Promise.all([
      db.query(query, [id]),
      db.query(inchargesQuery),
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

    if (session.role === "volunteer") {
      const { volunteer_email, incharge_email, ...filteredRecord } = hrRecord;
      return {
        data: filteredRecord,
        incharges: [], // Volunteers can't see incharges
      };
    }

    return {
      data: hrRecord,
      incharges: inchargesResult.rows.map((i) => i.email),
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
    comments: formData.comments,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const validatedData = validatedFields.data;

  // First check if the user has permission to edit this record
  const checkQuery = `
    SELECT h.id, h.volunteer_email, uv.incharge_email
    FROM hr_contacts h
    LEFT JOIN users uv ON uv.email = h.volunteer_email
    WHERE h.id = $1
  `;

  try {
    const checkResult = await db.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
      return { errors: "HR record not found" };
    }

    const hrRecord = checkResult.rows[0];

    // Check permissions based on role
    if (
      session.role === "volunteer" &&
      hrRecord.volunteer_email !== session.email
    ) {
      return { errors: "Unauthorized - You can only edit your own records" };
    }

    if (
      session.role === "incharge" &&
      hrRecord.incharge_email !== session.email
    ) {
      return {
        errors: "Unauthorized - You can only edit records assigned to you",
      };
    }

    // Determine new volunteer assignment
    let newVolunteerEmail = hrRecord.volunteer_email;
    if (session.role === "volunteer") {
      newVolunteerEmail = session.email;
    } else if (session.role === "incharge") {
      if (formData.volunteer_email && formData.volunteer_email !== hrRecord.volunteer_email) {
        const checkVolunteer = await db.query(
          "SELECT 1 FROM users WHERE email = $1 AND role = 'volunteer' AND incharge_email = $2",
          [formData.volunteer_email, session.email]
        );
        if (checkVolunteer.rows.length === 0) {
          return { errors: "Specified volunteer is not assigned to you" };
        }
        newVolunteerEmail = formData.volunteer_email;
      }
    } else if (session.role === "admin") {
      if (formData.volunteer_email && formData.volunteer_email !== hrRecord.volunteer_email) {
        const checkVolunteer = await db.query(
          "SELECT 1 FROM users WHERE email = $1 AND role = 'volunteer'",
          [formData.volunteer_email]
        );
        if (checkVolunteer.rows.length === 0) {
          return { errors: "Specified volunteer email does not exist" };
        }
        newVolunteerEmail = formData.volunteer_email;
      }
    }

    const query = `
      WITH updated AS (
        UPDATE hr_contacts SET
          hr_name = $1,
          phone_number = $2,
          email = $3,
          interview_mode = $4,
          company = $5,
          status = $6,
          hr_count = $7,
          transport = $8,
          address = $9,
          internship = $10,
          comments = $11,
          volunteer_email = $12
        WHERE id = $13
        RETURNING *
      )
      SELECT u.*, uv.incharge_email AS incharge_email, uv.name AS volunteer, ui.name AS incharge
      FROM updated u
      JOIN users uv ON uv.email = u.volunteer_email
      LEFT JOIN users ui ON ui.email = uv.incharge_email
    `;

    const values = [
      validatedData.hr_name,
      validatedData.phone_number,
      validatedData.email,
      validatedData.interview_mode,
      validatedData.company,
      validatedData.status,
      validatedData.hr_count,
      validatedData.transport,
      validatedData.address,
      validatedData.internship,
      validatedData.comments,
      newVolunteerEmail,
      id,
    ];

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return { errors: "HR record not found" };
    }
    return { data: result.rows[0] };
  } catch (error) {
    console.error("Error updating HR record:", error);
    // Check for unique constraint violation
    if (error.code === "23505" && error.constraint === "unique_phone_number") {
      return {
        errors:
          "Phone number already exists in the database. Duplicate entries are not allowed.",
      };
    }
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
    SELECT h.id, h.volunteer_email, uv.incharge_email
    FROM hr_contacts h
    LEFT JOIN users uv ON uv.email = h.volunteer_email
    WHERE h.id = $1
  `;

  try {
    const checkResult = await db.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
      return { errors: "HR record not found" };
    }

    const hrRecord = checkResult.rows[0];

    // Check permissions based on role
    if (
      session.role === "volunteer" &&
      hrRecord.volunteer_email !== session.email
    ) {
      return { errors: "Unauthorized - You can only delete your own records" };
    }

    if (
      session.role === "incharge" &&
      hrRecord.incharge_email !== session.email
    ) {
      return {
        errors: "Unauthorized - You can only delete records assigned to you",
      };
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

export async function getMemberStats() {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  if (session.role !== "volunteer") {
    return { errors: "Unauthorized" };
  }

  const query = `
    SELECT 
      COUNT(CASE WHEN status = 'Email_Sent' THEN 1 END) as "Email Sent",
      COUNT(CASE WHEN status = 'Not_Called' THEN 1 END) as "Not Called",
      COUNT(CASE WHEN status = 'Active' THEN 1 END) as "Accepted Invite",
      COUNT(CASE WHEN status = 'Pending' THEN 1 END) as "Awaiting Response",
      COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as "Called Declined",
      COUNT(CASE WHEN status = 'Emailed_Declined' THEN 1 END) as "Emailed Declined",
      COUNT(CASE WHEN status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(CASE WHEN status = 'Not_Reachable' THEN 1 END) as "Not Reachable",
      COUNT(CASE WHEN status = 'Wrong_Number' THEN 1 END) as "Wrong Number",
      COUNT(CASE WHEN status = 'Called_Postponed' THEN 1 END) as "Called Postponed",
      COUNT(*) as total_contacts
    FROM hr_contacts
    WHERE volunteer_email = $1
  `;

  try {
    const result = await db.query(query, [session.email]);
    return { data: result.rows[0] };
  } catch (error) {
    console.error("Error fetching member stats:", error);
    return { errors: "Failed to fetch member statistics" };
  }
}

export async function getInchargeStats(inchargeEmail) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }
  if (session.role !== "incharge" && session.role !== "admin") {
    return { errors: "Unauthorized" };
  }

  const query = `
    SELECT 
      u.name,
      COUNT(CASE WHEN h.status = 'Email_Sent' THEN 1 END) as "Email Sent",
      COUNT(CASE WHEN h.status = 'Not_Called' THEN 1 END) as "Not Called",
      COUNT(CASE WHEN h.status = 'Active' THEN 1 END) as "Accepted Invite",
      COUNT(CASE WHEN h.status = 'Pending' THEN 1 END) as "Awaiting Response",
      COUNT(CASE WHEN h.status = 'Inactive' THEN 1 END) as "Called Declined",
      COUNT(CASE WHEN h.status = 'Emailed_Declined' THEN 1 END) as "Emailed Declined",
      COUNT(CASE WHEN h.status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(CASE WHEN h.status = 'Not_Reachable' THEN 1 END) as "Not Reachable",
      COUNT(CASE WHEN h.status = 'Wrong_Number' THEN 1 END) as "Wrong Number",
      COUNT(CASE WHEN h.status = 'Called_Postponed' THEN 1 END) as "Called Postponed",
      COUNT(h.id) as contacts
    FROM users u
    LEFT JOIN hr_contacts h ON u.email = h.volunteer_email
    WHERE u.role = 'volunteer' 
    AND u.incharge_email = $1
    GROUP BY u.name
    ORDER BY u.name
  `;

  try {
    const result = await db.query(query, [
      session.role === "incharge" ? session.email : inchargeEmail,
    ]);
    return { data: result.rows };
  } catch (error) {
    console.error("Error fetching member stats:", error);
    return { errors: "Failed to fetch member statistics" };
  }
}

export async function getAdminStats() {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }
  if (session.role !== "admin") {
    return { errors: "Unauthorized" };
  }

  const query = `
    SELECT 
      ui.name,
      COUNT(CASE WHEN h.status = 'Email_Sent' THEN 1 END) as "Email Sent",
      COUNT(CASE WHEN h.status = 'Not_Called' THEN 1 END) as "Not Called",
      COUNT(CASE WHEN h.status = 'Active' THEN 1 END) as "Accepted Invite",
      COUNT(CASE WHEN h.status = 'Pending' THEN 1 END) as "Awaiting Response",
      COUNT(CASE WHEN h.status = 'Inactive' THEN 1 END) as "Called Declined",
      COUNT(CASE WHEN h.status = 'Emailed_Declined' THEN 1 END) as "Emailed Declined",
      COUNT(CASE WHEN h.status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(CASE WHEN h.status = 'Not_Reachable' THEN 1 END) as "Not Reachable",
      COUNT(CASE WHEN h.status = 'Wrong_Number' THEN 1 END) as "Wrong Number",
      COUNT(CASE WHEN h.status = 'Called_Postponed' THEN 1 END) as "Called Postponed",
      COUNT(h.id) as contacts
    FROM users ui
    LEFT JOIN users uv ON uv.incharge_email = ui.email AND uv.role = 'volunteer'
    LEFT JOIN hr_contacts h ON uv.email = h.volunteer_email
    WHERE ui.role = 'incharge'
    GROUP BY ui.name
    ORDER BY ui.name
  `;

  try {
    const result = await db.query(query, []);
    return { data: result.rows };
  } catch (error) {
    console.error("Error fetching incharge stats:", error);
    return { errors: "Failed to fetch incharge statistics" };
  }
}

export async function addHrBulk(hrDataArray) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  if (hrDataArray.length === 0) {
    return { errors: "No records to upload" };
  }

  try {
    // Only volunteers can bulk upload in the new model (volunteer_email must reference a volunteer)
    if (session.role !== "volunteer") {
      return { errors: "Only volunteers can upload CSV in this version" };
    }

    // 1. Generate VALUES clause for temp table insert
    const valuePlaceholders = hrDataArray
      .map(
        (_, index) =>
          `($${index * 12 + 1}, $${index * 12 + 2}, $${index * 12 + 3}, $${
            index * 12 + 4
          }, $${index * 12 + 5}, $${index * 12 + 6}, $${index * 12 + 7}, $${
            index * 12 + 8
          }, $${index * 12 + 9}, $${index * 12 + 10}, $${index * 12 + 11}, $${
            index * 12 + 12
          })`
      )
      .join(", ");
    const flattenedValues = hrDataArray.flatMap((record) => [
      record.hr_name,
      record.phone_number,
      record.email || "",
      record.interview_mode || "Not Confirmed",
      record.company,
      "Not_Called",
      1,
      record.transport || "",
      record.address || "",
      "No",
      record.comments || "",
      session.email, // volunteer_email
    ]);

    // 2. Construct and execute the combined query
    const query = `
      WITH temp_data (
          hr_name, phone_number, email, interview_mode, company,
          status, hr_count, transport, address, internship, comments, volunteer_email
      ) AS (
        VALUES ${valuePlaceholders}
      ),
      inserted AS (
        INSERT INTO hr_contacts (
            hr_name, phone_number, email, interview_mode, company,
            status, hr_count, transport, address, internship, comments, volunteer_email
        )
        SELECT
            hr_name, phone_number, email, interview_mode, company,
            status, hr_count::INT, transport,
            address, internship, comments, volunteer_email
        FROM temp_data
        ON CONFLICT (phone_number) DO NOTHING
        RETURNING *
      )
      SELECT
        td.hr_name, td.phone_number, td.email, td.company
      FROM temp_data td
      LEFT JOIN inserted i ON td.phone_number = i.phone_number
      WHERE i.phone_number IS NULL;
    `;
    const result = await db.query(query, flattenedValues);
    const duplicateRows = result.rows;

    // 3. Prepare and return result
    const successfulCount = hrDataArray.length - duplicateRows.length;
    return {
      success: true,
      successfulCount: successfulCount,
      duplicates: duplicateRows.length > 0 ? duplicateRows : null,
      message: `Successfully added ${successfulCount} records${
        duplicateRows.length > 0
          ? `. ${duplicateRows.length} duplicates found.`
          : "."
      }`,
    };
  } catch (error) {
    console.error("Error during bulk insert:", error);
    return { success: false, errors: "Error during bulk insert." };
  }
}
