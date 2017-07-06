var jwt = require('jsonwebtoken');

var authController = function (User) {

    var register = function (req, res) {
        var newUser = new User(req.body);
        newUser.save(function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else {
                var token = jwt.sign({ '_id': user._id }, process.env.secret, {
                    expiresIn: 10080 // 7 days
                });
                res.status(201).json({ user: user, token: 'JWT ' + token });
            }
        });
    };

    var authenticate = function (req, res) {
        User.findOne({ userName: req.body.userName }, function (err, user) {
            if (err)
                res.status(500).send(err);
            if (!user) {
                res.status(404).send('user not found');
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.sign({ '_id': user._id }, process.env.secret, {
                            expiresIn: 10080 // 7 days
                        });
                        res.json({ user: user, token: 'JWT ' + token });
                    } else {
                        res.status(401).send('Unauthorized: wrong password');
                    }
                });
            }
        });
    };

    return {
        register: register,
        authenticate: authenticate
    };
};

module.exports = authController;