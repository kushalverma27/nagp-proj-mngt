const express = require('express');
const router = express.Router();

const openingsList = require('../models/openings');



  router.get

  function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
