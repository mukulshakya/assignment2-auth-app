function authenticationMiddleware() {  
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}

module.exports = {auth: authenticationMiddleware}