module.exports = function(req, res, next) {
   if (req.isAuthenticated()) {
        return next();
    }
    else{
        throw new Error('Authenticate Error!')
    }
};