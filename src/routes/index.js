const express = require('express');
const router = express.Router();
const openingsList = require('../models/openings');
const users = require('../models/user');
const passport = require('passport');
middleware = require('../middleware/middleware');


router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('signup-local', {
    successRedirect: '/profile', 
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('signin-local', {
    successRedirect: '/profile', 
    failureRedirect: '/signin',
    passReqToCallback: true   
}));

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
});

router.get('/profile', middleware.isLoggedIn, (req, res, next) => {
    res.render('profile');
})

router.post('/upload', middleware.isLoggedIn, (req, res, next) => {
  
      res.render('profile');

})

router.get('/addopening',  middleware.isLoggedIn, (req, res, next) => {
    res.render('addOpening');
})

router.get('/openingsList/:_id',  middleware.isLoggedIn, function(req, res) {
    openingsList.findById(req.params._id, function(err, opening) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('viewOpening', {
        opening: opening
      });
    }
  });
});

router.get('/openingDetails/:_id',  middleware.isLoggedIn, function(req, res) {
  openingsList.findById(req.params._id, function(err, opening) {
  if (err) {
    res.redirect('back');
  } else {
    res.render('openingDetails', {
      opening: opening
    });
  }
});
});

router.get('/openingsList',  middleware.isLoggedIn, function(req, res) {
    openingsList.find({}, function(err, list) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('openingsList', {
        openings: list
      });
    }   
  });
});


router.post('/add',  middleware.isLoggedIn, function(req, res) {
  var project = req.body.project;
  var client = req.body.client;
  var title = req.body.title;
  var technologies = req.body.technologies;
  var desc = req.body.desc;

  var newOpening = {
    project : project,
    client:client,
    title: title,
    technologies:technologies,
    desc: desc,
    status: true,
    addedby: req.user._id,
    applicants:''
  };
  openingsList.create(newOpening, function(err, newlyCreated) {
    if (err) {
      req.flash('error', 'Opening could not be created');
    } else {
      req.flash('success', 'Opening was added');
      res.redirect('/');
    }
  });
}); 

router.post('/update',  middleware.isLoggedIn, function(req, res) {
  if(req.body.radioGroup2 == 'false') {
    openingsList.findById(req.body.id, function(err, opening) {
      if (err) {
        req.flash('error', 'Opening could not be updated');
      } else {
        var applicants = opening.applicants;
        applicants = applicants + '';
        var splitArray = applicants.split(',');
        for (var i = 0; i < splitArray.length; i++) {
          users.findById(splitArray[i], function(err, user) {
            if (err) {
              req.flash('error', 'Opening could not be created');
            } else {
                var not3 =  user.notification2;
                var not2 =  user.notification1;
                var not1 =  'Position for '+req.body.title+" in project "+req.body.project+ ' is now closed';
              users.findByIdAndUpdate(user._id, {notification1:not1,notification2:not2,notification3:not3 }, function(err, user) {
                if (err) {
                  req.flash('error', 'Opening could not be created');
                } else {
                  req.flash('success', 'Notification added');
                }
              });
            }
          });
        }
      }
    });
  openingsList.findByIdAndUpdate(req.body.id, {project: req.body.project, client: req.body.client, technologies: req.body.technologies, title:req.body.title, desc:req.body.desc,status:req.body.radioGroup2, applicants:''}, function(err, newlyCreated) {
    if (err) {
      req.flash('error', 'Opening could not be created');
    } else {
      req.flash('success', 'Opening was updated');
      res.redirect('/openingsList');
    }
  });
} else {
  openingsList.findByIdAndUpdate(req.body.id, {project: req.body.project, client: req.body.client, technologies: req.body.technologies, title:req.body.title, desc:req.body.desc,status:req.body.radioGroup2}, function(err, newlyCreated) {
    if (err) {
      req.flash('error', 'Opening could not be created');
    } else {
      req.flash('success', 'Opening was updated');
      res.redirect('/openingsList');
    }
  });
}
}); 

router.post('/apply',  middleware.isLoggedIn, function(req, res) {
 // console.log(req.user._id)
 // console.log(req.body.id)
 users.findById(req.user._id, function(err, user) {
  if (err) {
    req.flash('error', 'Opening could not be created');
  } else {
      var not3 =  user.notification2;
      var not2 =  user.notification1;
      var not1 =  'Applied for position '+req.body.title+" in project "+req.body.project;
    users.findByIdAndUpdate(req.user._id, {notification1:not1,notification2:not2,notification3:not3 }, function(err, opening) {
      if (err) {
        req.flash('error', 'Opening could not be created');
      } else {
        req.flash('success', 'Notification added');
      }
    });

  }
});

 
  openingsList.findById(req.body.id, function(err, opening) {
    if (err) {
      req.flash('error', 'Opening could not be created');
    } else {
      var applicants = opening.applicants;
      if (!containsValue(applicants, req.user._id)) {
     if (applicants.length < 1) {
      applicants =  req.user._id;
     } else {
      applicants =  applicants + ',' + req.user._id;
     }
      openingsList.findByIdAndUpdate(req.body.id, {applicants:applicants}, function(err, opening) {
        if (err) {
          req.flash('error', 'Opening could not be created');
        } else {
          res.redirect('/openingsList');
        }
      });
    }
    else {
      res.redirect('/openingsList');
    }
    }
  });
}); 


function containsValue(arr, val) {
  arr = arr + '';
  var splitArray = arr.split(',');
  for (var i = 0; i < splitArray.length; i++) {
      if(splitArray[i]==val) return true;
  }
  return false;
}

module.exports = router;