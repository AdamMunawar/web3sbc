const path = require('path');
const nodemailer = require('nodemailer');

module.exports = function(app, db, multer) {
    const upload = multer({
        dest: 'uploads/',
        limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'documents') {
                cb(null, true);
            } else {
                cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
            }
        }
    });

    // Middleware to check if the user is authenticated
    function checkAuthenticated(req, res, next) {
        if (!req.session.user) {
            return res.status(401).send("Unauthorized");
        }
        next();
    }

    // Function to send email
    async function sendEmail(userEmail, registrationData) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'muhammadadam.005@gmail.com',
                pass: 'sirojuddin25'
            }
        });

        let mailOptions = {
            from: 'adamsirojuddin.12@gmail.com',
            to: userEmail,
            subject: 'Registration Successful',
            text: `Dear ${registrationData.fullName},\n\nYour registration has been successful. Here are your details:\n\nFull Name: ${registrationData.fullName}\nBirth Date: ${registrationData.birthDate}\nNIK: ${registrationData.nik}\nParent Name: ${registrationData.parentName}\nSchool Origin: ${registrationData.schoolOrigin}\nSchool Target: ${registrationData.schoolTarget}\nMajor Choice: ${registrationData.majorChoice}\n\nBest Regards,\Pesantren Sumur Bandung`
        };

        await transporter.sendMail(mailOptions);
    }

    // Handle registration with file upload
    app.post('/pendaftaran', upload.array('documents', 3), (req, res) => {
        const { fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, email } = req.body;

        if (!req.files || req.files.length !== 3) {
            return res.status(400).send("Please upload exactly 3 files (Ijazah/SKL, KK, KTP Orang Tua).");
        }

        const documents = req.files.map(file => file.path);

        db.run(`INSERT INTO registrations (fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, email, documents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, email, JSON.stringify(documents)], async function(err) {
            if (err) {
                return res.status(400).send("Error inserting data: " + err.message);
            }

            // Set session variable indicating PSB registration completion
            req.session.psbRegistered = true;

            // Send email to user
            try {
                await sendEmail(email, { fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice });
                res.redirect('/index.html');
            } catch (error) {
                res.status(500).send("Error sending email: " + error.message);
            }
        });
    });

    // Other endpoints...

    // Endpoint to get all registrants for the logged-in user
    app.get('/registrants', checkAuthenticated, (req, res) => {
        const userId = req.session.user.id;
        db.all(`SELECT id, fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice FROM registrations WHERE userId = ?`, [userId], (err, rows) => {
            if (err) {
                return res.status(500).send("Error retrieving data: " + err.message);
            }
            res.json(rows);
        });
    });

    // Endpoint to get a single registrant by ID for the logged-in user
    app.get('/registrants/:id', checkAuthenticated, (req, res) => {
        const { id } = req.params;
        const userId = req.session.user.id;
        db.get(`SELECT id, fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice FROM registrations WHERE id = ? AND userId = ?`, [id, userId], (err, row) => {
            if (err) {
                return res.status(500).send("Error retrieving data: " + err.message);
            }
            res.json(row);
        });
    });

    // Endpoint to create a new registrant
    app.post('/registrants', checkAuthenticated, (req, res) => {
        const userId = req.session.user.id;
        const { fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice } = req.body;
        db.run(`INSERT INTO registrations (userId, fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [userId, fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice], function(err) {
            if (err) {
                return res.status(400).send("Error inserting data: " + err.message);
            }
            res.send("Data inserted successfully");
        });
    });

    // Endpoint to update an existing registrant
    app.put('/registrants/:id', checkAuthenticated, (req, res) => {
        const { id } = req.params;
        const userId = req.session.user.id;
        const { fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice } = req.body;
        db.run(`UPDATE registrations SET fullName = ?, birthDate = ?, nik = ?, parentName = ?, schoolOrigin = ?, schoolTarget = ?, majorChoice = ? WHERE id = ? AND userId = ?`, 
            [fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, id, userId], function(err) {
            if (err) {
                return res.status(400).send("Error updating data: " + err.message);
            }
            res.send("Data updated successfully");
        });
    });

    // Endpoint to delete a registrant
    app.delete('/registrants/:id', checkAuthenticated, (req, res) => {
        const { id } = req.params;
        const userId = req.session.user.id;
        db.run(`DELETE FROM registrations WHERE id = ? AND userId = ?`, [id, userId], function(err) {
            if (err) {
                return res.status(400).send("Error deleting data: " + err.message);
            }
            res.send("Data deleted successfully");
        });
    });
};
