const router = require("express").Router();
const { Comment } = require("../../models");

// route to get all comments
router.get("/", async (req, res) => {
    try {
        const comments = await Comment.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }, {
                model: Post,
                attributes: ['id'],
            }]
        });
    } catch {
        res.status(500).json(err);
    }
});

// route to create a new comment
router.post("/", async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })

        res.status(200).json(newComment);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// route to update a comment
router.put("/:id", isAuth, async (req, res) => {
    try {
        const updateComment = await Comment.update({
            content: req.body.content
        }, {
            where: {
                id: req.params.id
            }
        });
        if (!updateComment) {
            res.status(404).json({ message: "No comment found with this id" });
            return;
        }
        res.status(200).json(updateComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// route to delete a comment
router.delete("/:id", isAuth, async (req, res) => {
    try {
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!deleteComment) {
            res.status(404).json({ message: "No comment found with this id" });
            return;
        }
        res.status(200).json(deleteComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;