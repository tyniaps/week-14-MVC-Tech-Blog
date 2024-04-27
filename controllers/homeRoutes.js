const router = require('express').Router(); 
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true}));

        res.render('homepage', {
            blogPosts,
            logged_in: req.session.logged_in
        });
    }   catch (err) {
        res.status(500).jdon(err);
    }
});

    router.get('/blogPost/:id', async (req, res) => {
        try {
            const blogPostData = await BlogPost.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ['name'],
                    },
                ],
            });



            const blogPost = blogPostData.get({ plain: true});

            res.render('blogPost', {
                ...blogPost, 
                logged_in: req.session.logged_in
            });
        }   catch (err) {
            res.status(500).json(err);
        }
    });

router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
          attributes: { exclude: ['password'] },
          include: [{ model: BlogPost}],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    }   catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.redirect('login');
});


module.exports = router;