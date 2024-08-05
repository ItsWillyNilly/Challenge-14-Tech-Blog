const router = require('express').Router();
const { User } = require('../../models');

// route to create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;

            res.status(200).json(newUser);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// route to login
router.post('/login', async (req, res) => {
    try {
        const loginUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!loginUser) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await loginUser.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = loginUser.id;
            req.session.logged_in = true;

            res.json({ user: loginUser, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json({ error: err, message: 'Something went wrong.' });
    }
});

// route to log a user out
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;