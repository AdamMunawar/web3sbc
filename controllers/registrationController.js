const path = require('path');
const db = require('../db/database');

exports.register = (req, res) => {
    const { fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice } = req.body;

    // Assuming that 'documents' array contains 3 files: [Ijazah/SKL, KK, KTP Orang Tua]
    const documents = req.files.map(file => file.path);

    db.run(`INSERT INTO registrations (fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, documents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, JSON.stringify(documents)], function(err) {
        if (err) {
            return res.status(400).send("Error inserting data: " + err.message);
        }
        res.send(`
            <script>
                alert('User registered successfully!');
                window.location.href = '/profil.html';
            </script>
        `);
    });
};
