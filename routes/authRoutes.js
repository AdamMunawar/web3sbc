const path = require('path');

module.exports = function(app, db) {
    // Middleware to check if the user is logged in
    function checkNotAuthenticated(req, res, next) {
        if (req.session.user) {
            return res.redirect('/profil.html');
        }
        next();
    }

    function checkAuthenticated(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login.html');
        }
        next();
    }

    // Serve the registration page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    // Serve the form registration page
    app.get('/form-daftar.html', checkAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'form-daftar.html'));
    });

    // Handle registration
    app.post('/register', (req, res) => {
        const { username, password } = req.body;
        db.get(`SELECT email FROM users WHERE email = ?`, [username], (err, row) => {
            if (err) {
                return res.status(500).send("Error checking email: " + err.message);
            }
            if (row) {
                return res.send(`
                    <script>
                        alert('Email sudah terdaftar. Silakan gunakan email lain.');
                        window.history.back();
                    </script>
                `);
            }
            db.run(`INSERT INTO users(email, password) VALUES (?, ?)`, [username, password], function(err) {
                if (err) {
                    return res.status(400).send("Error inserting data: " + err.message);
                }
                res.send(`
                    <script>
                        alert('User registered successfully!');
                        window.location.href = '/login.html';
                    </script>
                `);
            });
        });
    });

    // Serve login page
    app.get('/login.html', checkNotAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'login.html'));
    });

    // Handle login
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [username, password], (err, row) => {
            if (err) {
                return res.status(500).send("Error checking credentials: " + err.message);
            }
            if (row) {
                req.session.user = row;
                res.send(`
                    <script>
                        alert('Login successful!');
                        window.location.href = '/profil.html';
                    </script>
                `);
            } else {
                res.send(`
                    <script>
                        alert('Invalid username or password');
                        window.location.href = '/login.html';
                    </script>
                `);
            }
        });
    });

    // Handle logout
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Error logging out: " + err.message);
            }
            res.send(`
                <script>
                    alert('Logout successful!');
                    window.location.href = '/login.html';
                </script>
            `);
        });
    });

    // Endpoint to check if the user is logged in
    app.get('/check-login', (req, res) => {
        if (req.session.user) {
            res.json({ loggedIn: true });
        } else {
            res.json({ loggedIn: false });
        }
    });
};
