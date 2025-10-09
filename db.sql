-- new schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    incharge_email VARCHAR(255),
    name VARCHAR(255),
    CONSTRAINT fk_incharge_email FOREIGN KEY (incharge_email)
        REFERENCES users(email) ON DELETE SET NULL
);

CREATE TABLE hr_contacts (
    id SERIAL PRIMARY KEY,
    hr_name VARCHAR(255),
    volunteer_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    phone_number VARCHAR(50),
    email VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(50),
    interview_mode VARCHAR(50),
    hr_count INTEGER DEFAULT 1,
    transport VARCHAR(255),
    address TEXT,
    internship VARCHAR(50),
    comments TEXT
);

-- old schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    incharge_email VARCHAR(255),
    name VARCHAR(255)
);

CREATE TABLE hr_contacts (
    id SERIAL PRIMARY KEY,
    hr_name VARCHAR(255),
    volunteer VARCHAR(255),
    incharge VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(50),
    status VARCHAR(50),
    interview_mode VARCHAR(50),
    hr_count INTEGER,
    transport VARCHAR(255),
    address TEXT,
    internship VARCHAR(50),
    comments TEXT,
    volunteer_email VARCHAR(255),
    incharge_email VARCHAR(255)
);
