module.exports = {
    isAuthenticated: function(req, res, next) {
        if (req.session.user) {
            return next();
        }
        res.redirect('/auth/login.html');
    },
    checkNotAuthenticated: function(req, res, next) {
        if (req.session.user) {
            return res.redirect('/profil.html');
        }
        next();
    }
};
