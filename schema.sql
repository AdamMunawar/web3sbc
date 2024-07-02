CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    birthDate TEXT NOT NULL,
    nik TEXT NOT NULL,
    parentName TEXT NOT NULL,
    schoolOrigin TEXT NOT NULL,
    schoolTarget TEXT NOT NULL,
    majorChoice TEXT NOT NULL,
    documents TEXT NOT NULL
);
