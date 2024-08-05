const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const isAuth = require('../../utils/auth');

// router to login page
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

// router for the homepage that renders it 
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    atributes: ['content'],
                },
            ]
        });
        const allPosts = posts.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            allPosts,
            logged_in: req.session.logged_in,
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

// gets one post and reders it to the blogpost page
router.get("/post/:id", isAuth, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: [User],
                },
            ],
        });

        const singlePost = post.get({ plain: true });

        res.render("singlePost", {
            ...singlePost,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', isAuth, async (req, res) => {
    try {
        const userPosts = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Post,
                    include: [User],
                },
                {
                    model: Comment,
                },
            ],
        });

        const user = userPosts.get({ plain: true });
        console.log(user);

        res.render('dashboard', {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/newPost', async (req, res) => {
    try {
        if (req.session.logged_in) {
            res.render('newPost', {
                logged_in: req.session.logged_in,
                userId: req.session.user_id,
            });
            return;
        } else {
            res.redirect('/login');
        }
    } catch {
        res.status(500).json(err);
    }
});

router.get('/newPost/:id', async (req, res) => {
    try {
        const updatePost = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: [User],
                }
            ],
        });

        const post = updatePost.get({ plain: true });

        if (req.session.logged_in) {
            res.render('update', {
                ...updatePost,
                logged_in: req.session.logged_in,
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;