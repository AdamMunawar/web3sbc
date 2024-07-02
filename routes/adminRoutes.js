const path = require('path');

module.exports = function(app, db) {
    // Serve admin page
    app.get('/admin.html', checkAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'admin.html'));
    });

    // Serve admin users page
    app.get('/admin/users', checkAuthenticated, (req, res) => {
        db.all(`SELECT id, email, role FROM users`, (err, rows) => {
            if (err) {
                return res.status(500).send("Error retrieving data: " + err.message);
            }
            res.json(rows);
        });
    });

    // Serve admin registrations page
    app.get('/admin/registrations', checkAuthenticated, (req, res) => {
        db.all(`SELECT * FROM registrations`, (err, rows) => {
            if (err) {
                return res.status(500).send("Error retrieving data: " + err.message);
            }
            res.json(rows);
        });
    });

    // Endpoint to update registration
    app.post('/admin/update-registration', checkAuthenticated, (req, res) => {
        const { id, fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice } = req.body;
        db.run(`UPDATE registrations SET fullName = ?, birthDate = ?, nik = ?, parentName = ?, schoolOrigin = ?, schoolTarget = ?, majorChoice = ? WHERE id = ?`, 
        [fullName, birthDate, nik, parentName, schoolOrigin, schoolTarget, majorChoice, id], function(err) {
            if (err) {
                return res.status(400).send("Error updating data: " + err.message);
            }
            res.send("Data updated successfully");
        });
    });

    // Endpoint to get specific registration data for editing
    app.get('/admin/registration/:id', checkAuthenticated, (req, res) => {
        const id = req.params.id;
        db.get(`SELECT * FROM registrations WHERE id = ?`, [id], (err, row) => {
            if (err) {
                return res.status(500).send("Error retrieving data: " + err.message);
            }
            res.json(row);
        });
    });

    // Middleware to check if the user is authenticated
    function checkAuthenticated(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login.html');
        }
        next();
    }
};
