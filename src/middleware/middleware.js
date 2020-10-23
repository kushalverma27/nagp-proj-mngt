var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'Kindly Log in');
    res.redirect('/');
  }
};

module.exports = middlewareObj;