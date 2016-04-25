var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var jwt = require('jwt-simple');

var User = require('../models/user'),
	Pin = require('../models/pin');

const jwtSecretToken = 'n3tnr3it4t54mgrg';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new Strategy({
    consumerKey: 'Pm1ANWBNdkwQawGyaovoPm8Al',
    consumerSecret: 'gTEJg3PqRRJOWpXHOM7BC2eb1Pe4LdISUqXmwNqbnvxge4BSZZ',
    callbackURL: "http://127.0.0.1:3000/api/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
  	User.findOne({ 'twitterId' : profile.id }, function(err, user) {
        if (err)
            return cb(err);

        if (user) {
            return cb(null, user); 
        } else {
            var newUser = new User({
            	twitterId: profile.id,
            	username: profile.username
            });

            newUser.save(function(err) {
                if (err)
                    throw err;
                return cb(null, newUser);
            });
        }
    });
  }
));

router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/login', function(req, res, next){
	if(req.user){
		var payload = {
				iss: req.user._id
			};
		var token = jwt.encode(payload, jwtSecretToken);

		return res.json({
			username: req.user.username,
			token: token
		});
	}else{
		return res.status(401).end();
	}
});

router.get('/logout', function(req, res){
	req.logout();
	return res.status(200).end();
});

router.post('/getmypins', function(req, res){
		var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

		User.findById(userId, function(err, user){
			if(err) throw err;

			Pin.find({addedBy: userId},{title: 1, url: 1}, {sort: {published: -1}}, function(err, pins){
				if(err) throw err;

				return res.json({
					success: true,
					pins: pins
				});
			})
		});		
});

router.post('/newpin', function(req, res){
		var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

		User.findById(userId, function(err, user){
			if(err) throw err;

			var newPin = new Pin({
				title: req.body.title,
				url: req.body.url,
				addedBy: userId
			});

			newPin.save(function(err){
				if(err) throw err;

				Pin.find({addedBy: userId},{title: 1, url: 1}, {sort: {published: -1}}, function(err, pins){
					if(err) throw err;

					return res.json({
						success: true,
						pins: pins
					});
				})
			});
		});	
});

router.post('/removepin', function(req, res){
		var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

		User.findById(userId, function(err, user){
			if(err) throw err;

			Pin.remove({_id: req.body.pin._id}, function(err){
				if(err) throw err;

				Pin.find({addedBy: userId},{title: 1, url: 1}, {sort: {published: -1}}, function(err, pins){
					if(err) throw err;

					return res.json({
						success: true,
						pins: pins
					});
				});
			});
		});		
});

router.get('/getpins', function(req, res){

	Pin.find({},{title: 1, url: 1}, {sort: {published: -1}}, function(err, pins){
		if(err) throw err;

		return res.json({
			success: true,
			pins: pins
		});
	});
	
});

module.exports = router;
