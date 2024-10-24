import psycopg2
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# Database connection parameters
DB_NAME = "hrdb"
DB_USER = "jerryadmin"
DB_PASSWORD = "sedlifedes"
DB_HOST = "192.168.1.10"
DB_PORT = "5432"

# Connect to the database
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)

# Create a cursor object
cur = conn.cursor()

# Create the table if it doesn't exist
cur.execute("""
CREATE TABLE IF NOT EXISTS hr_contacts (
    id SERIAL PRIMARY KEY,
    hr_name VARCHAR(100),
    volunteer VARCHAR(100),
    incharge VARCHAR(100),
    company VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(50),
    status VARCHAR(20),
    interview_mode VARCHAR(20),
    hr_count INTEGER,
    transport VARCHAR(20),
    address TEXT,
    internship VARCHAR(3),
    comments TEXT
)
""")

# Generate and insert 5000 fake records
for _ in range(5000):
    hr_name = fake.name()
    volunteer = fake.name()
    incharge = fake.name()
    company = fake.company()
    email = fake.email()
    phone_number = fake.phone_number()[:20]  # Truncate to 20 characters
    status = random.choice(["Active", "Inactive", "Pending"])
    interview_mode = random.choice(["Online", "In-person"])
    hr_count = random.randint(1, 20)
    transport = random.choice(["Required", "Not Required"])
    address = fake.address().replace("\n", ", ")
    internship = random.choice(["Yes", "No"])
    comments = fake.text(max_nb_chars=200)

    cur.execute("""
    INSERT INTO hr_contacts (hr_name, volunteer, incharge, company, email, phone_number, status, interview_mode, hr_count, transport, address, internship, comments)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (hr_name, volunteer, incharge, company, email, phone_number, status, interview_mode, hr_count, transport, address, internship, comments))

# Commit the changes and close the connection
conn.commit()
cur.close()
conn.close()

print("5000 fake records have been inserted into the database.")
