const router = include('express').Router();
const { Post } = require("../../models");
const isAuth = require("../../utils/auth");

// route to create a new post
router.post("/", isAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// route to update a new post
router.put("/:id", isAuth, async (req, res) => {
    try {
        const updatePost = await Post.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if (!updatePost) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.status(200).json(updatePost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// route to delete a post
router.delete("/:id", isAuth, async (req, res) => {
    try {
        const deletePost = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!deletePost) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.status(200).json(deletePost);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;