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
    console.log(validatedFields.error.flatten().fieldErrors);
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
        incharge_email: incharge.email,
      });
    } else {
      await createSession({
        email: user.email,
        role: user.role,
      });
    }

    role = user.role;
    user_name = user.name;
  } catch (error) {
    console.log("error", error);
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
    comments: formData.comments,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  if (
    session.role === "incharge" &&
    (!formData.volunteer_email || !formData.volunteer_email.includes("@"))
  ) {
    console.log("volunteer_email", formData.volunteer_email);
    return {
      errors: "A valid volunteer email is required",
    };
  }

  if (
    session.role === "admin" &&
    (!formData.incharge_email ||
      !formData.volunteer_email ||
      !formData.incharge_email.includes("@") ||
      !formData.volunteer_email.includes("@"))
  ) {
    return {
      errors:
        "Both incharge and volunteer emails are required and must be valid",
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
    session.role === "volunteer"
      ? session.incharge_email
      : formData.incharge_email,
    session.role === "volunteer" ? session.email : formData.volunteer_email,
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
    console.log("inchargeEmail", inchargeEmail);
    const inchargeQuery = "SELECT * FROM users WHERE email = $1 AND role = $2";
    const inchargeResult = await db.query(inchargeQuery, [
      inchargeEmail,
      "incharge",
    ]);

    if (inchargeResult.rows.length === 0) {
      // console.log("inchargeResult", inchargeResult);
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
    SELECT * FROM hr_contacts WHERE id = $1
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
      console.log("hr not found");
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
    SELECT * FROM hr_contacts WHERE id = $1
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
    volunteer_email = $14,
    incharge_email = $15
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
    SELECT * FROM hr_contacts WHERE id = $1
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
      COUNT(CASE WHEN h.status = 'Active' THEN 1 END) as "Accepted",
      COUNT(CASE WHEN h.status = 'Pending' THEN 1 END) as "Pending",
      COUNT(CASE WHEN h.status = 'Inactive' THEN 1 END) as "Declined",
      COUNT(CASE WHEN h.status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(*) as contacts
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
      u.name,
      COUNT(CASE WHEN h.status = 'Email_Sent' THEN 1 END) as "Email Sent",
      COUNT(CASE WHEN h.status = 'Not_Called' THEN 1 END) as "Not Called",
      COUNT(CASE WHEN h.status = 'Active' THEN 1 END) as "Accepted",
      COUNT(CASE WHEN h.status = 'Pending' THEN 1 END) as "Pending",
      COUNT(CASE WHEN h.status = 'Inactive' THEN 1 END) as "Declined",
      COUNT(CASE WHEN h.status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(*) as contacts
    FROM users u
    LEFT JOIN hr_contacts h ON u.email = h.incharge_email
    WHERE u.role = 'incharge'
    GROUP BY u.name
    ORDER BY u.name
  `;

  try {
    const result = await db.query(query, []);
    return { data: result.rows };
  } catch (error) {
    console.error("Error fetching incharge stats:", error);
    return { errors: "Failed to fetch incharge statistics" };
  }
}

// export async function addHrBulk(hrDataArray) {
//   const session = await getSession();
//   if (!session?.email) {
//     return { errors: "Unauthorized" };
//   }

//   // Validate each record
//   const validatedRecords = [];
//   const errors = [];

//   for (let i = 0; i < hrDataArray.length; i++) {
//     const record = hrDataArray[i];
//     const validatedFields = HrContactSchema.safeParse({
//       hr_name: record.hr_name,
//       phone_number: record.phone_number,
//       email: record.email,
//       interview_mode: record.interview_mode,
//       company: record.company,
//       volunteer: record.volunteer,
//       incharge: record.incharge,
//       status: record.status,
//       hr_count: record.hr_count ? parseInt(record.hr_count) : 1,
//       transport: record.transport,
//       address: record.address,
//       internship: record.internship || "No",
//       comments: record.comments,
//     });

//     if (!validatedFields.success) {
//       errors.push({
//         index: i,
//         record: record,
//         errors: validatedFields.error.flatten().fieldErrors,
//       });
//       continue;
//     }

//     // Add email validation based on role
//     if (
//       session.role === "incharge" &&
//       (!record.volunteer_email || !record.volunteer_email.includes("@"))
//     ) {
//       errors.push({
//         index: i,
//         record: record,
//         errors: "A valid volunteer email is required",
//       });
//       continue;
//     }

//     if (
//       session.role === "admin" &&
//       (!record.incharge_email ||
//         !record.volunteer_email ||
//         !record.incharge_email.includes("@") ||
//         !record.volunteer_email.includes("@"))
//     ) {
//       errors.push({
//         index: i,
//         record: record,
//         errors:
//           "Both incharge and volunteer emails are required and must be valid",
//       });
//       continue;
//     }

//     validatedRecords.push({
//       ...validatedFields.data,
//       incharge_email:
//         session.role === "volunteer"
//           ? session.incharge_email
//           : record.incharge_email,
//       volunteer_email:
//         session.role === "volunteer" ? session.email : record.volunteer_email,
//     });
//   }

//   if (errors.length > 0) {
//     return { errors: errors };
//   }

//   // Prepare bulk insert query
//   const query = `
//     INSERT INTO hr_contacts (
//       hr_name, phone_number, email, interview_mode, company,
//       volunteer, incharge, status, hr_count, transport,
//       address, internship, comments, incharge_email, volunteer_email
//     ) 
//     SELECT * FROM UNNEST (
//       $1::text[], $2::text[], $3::text[], $4::text[], $5::text[],
//       $6::text[], $7::text[], $8::text[], $9::integer[], $10::text[],
//       $11::text[], $12::text[], $13::text[], $14::text[], $15::text[]
//     )
//   `;

//   try {
//     // Transform records into column arrays
//     const values = [
//       validatedRecords.map((r) => r.hr_name),
//       validatedRecords.map((r) => r.phone_number),
//       validatedRecords.map((r) => r.email),
//       validatedRecords.map((r) => r.interview_mode),
//       validatedRecords.map((r) => r.company),
//       validatedRecords.map((r) => r.volunteer),
//       validatedRecords.map((r) => r.incharge),
//       validatedRecords.map((r) => r.status),
//       validatedRecords.map((r) => r.hr_count),
//       validatedRecords.map((r) => r.transport),
//       validatedRecords.map((r) => r.address),
//       validatedRecords.map((r) => r.internship),
//       validatedRecords.map((r) => r.comments),
//       validatedRecords.map((r) => r.incharge_email),
//       validatedRecords.map((r) => r.volunteer_email),
//     ];

//     await db.query(query, values);
//     return {
//       success: true,
//       message: `Successfully inserted ${validatedRecords.length} records`,
//     };
//   } catch (error) {
//     console.error("Error adding bulk HR records:", error);
//     if (error.code === "23505" && error.constraint === "unique_phone_number") {
//       return {
//         errors:
//           "One or more phone numbers already exist in the database. Duplicate entries are not allowed.",
//       };
//     }
//     return { errors: "Failed to add HR records" };
//   }
// }


export async function addHrBulk(hrDataArray) {
  const session = await getSession();
  if (!session?.email) {
    return { errors: "Unauthorized" };
  }

  // Validate each record
  const validatedRecords = [];
  const validationErrors = [];

  for (let i = 0; i < hrDataArray.length; i++) {
    const record = hrDataArray[i];
    const validatedFields = HrContactSchema.safeParse({
      hr_name: record.hr_name,
      phone_number: record.phone_number,
      email: record.email,
      interview_mode: record.interview_mode,
      company: record.company,
      volunteer: record.volunteer,
      incharge: record.incharge,
      status: record.status,
      hr_count: record.hr_count ? parseInt(record.hr_count) : 1,
      transport: record.transport,
      address: record.address,
      internship: record.internship || "No",
      comments: record.comments,
    });

    if (!validatedFields.success) {
      validationErrors.push({
        index: i,
        record: record,
        errors: validatedFields.error.flatten().fieldErrors,
      });
      continue;
    }

    // Add email validation based on role
    if (
      session.role === "incharge" &&
      (!record.volunteer_email || !record.volunteer_email.includes("@"))
    ) {
      validationErrors.push({
        index: i,
        record: record,
        errors: "A valid volunteer email is required",
      });
      continue;
    }

    if (
      session.role === "admin" &&
      (!record.incharge_email ||
        !record.volunteer_email ||
        !record.incharge_email.includes("@") ||
        !record.volunteer_email.includes("@"))
    ) {
      validationErrors.push({
        index: i,
        record: record,
        errors:
          "Both incharge and volunteer emails are required and must be valid",
      });
      continue;
    }

    validatedRecords.push({
      ...validatedFields.data,
      incharge_email:
        session.role === "volunteer"
          ? session.incharge_email
          : record.incharge_email,
      volunteer_email:
        session.role === "volunteer" ? session.email : record.volunteer_email,
    });
  }

  if (validationErrors.length === hrDataArray.length) {
    return { errors: validationErrors };
  }

  // Insert records one by one to handle duplicates
  const results = {
    success: [],
    duplicates: [],
    errors: validationErrors,
  };

  for (const record of validatedRecords) {
    const query = `
      INSERT INTO hr_contacts (
        hr_name, phone_number, email, interview_mode, company,
        volunteer, incharge, status, hr_count, transport,
        address, internship, comments, incharge_email, volunteer_email
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT ON CONSTRAINT unique_phone_number DO NOTHING
      RETURNING *;
    `;

    const values = [
      record.hr_name,
      record.phone_number,
      record.email,
      record.interview_mode,
      record.company,
      record.volunteer,
      record.incharge,
      record.status,
      record.hr_count,
      record.transport,
      record.address,
      record.internship,
      record.comments,
      record.incharge_email,
      record.volunteer_email,
    ];

    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        // This means the record was skipped due to duplicate phone number
        results.duplicates.push({
          phone_number: record.phone_number,
          hr_name: record.hr_name,
        });
      } else {
        results.success.push(result.rows[0]);
      }
    } catch (error) {
      console.error("Error adding HR record:", error);
      results.errors.push({
        record: record,
        error: "Database error while inserting record",
      });
    }
  }

  return {
    success: true,
    message: `Successfully inserted ${results.success.length} records`,
    results: {
      successful: results.success.length,
      duplicates: results.duplicates,
      errors: results.errors,
    },
  };
}