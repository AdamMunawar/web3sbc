const path = require('path');
const db = require('../db/mydatabase');

exports.loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
};

exports.login = (req, res) => {
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
                    window.location.href = '/auth/login.html';
                </script>
            `);
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error logging out: " + err.message);
        }
        res.send(`
            <script>
                alert('Logout successful!');
                window.location.href = '/auth/login.html';
            </script>
        `);
    });
};
