const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .populate('likes.user', 'name')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'name')
            .populate('likes.user', 'name')
            .populate('comments.user', 'name');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (protected)
router.post('/', protect, async (req, res) => {
    try {
        const { text, imageUrl } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Please provide post text' });
        }

        const post = await Post.create({
            user: req.user._id,
            text,
            imageUrl: imageUrl || ''
        });

        const populatedPost = await Post.findById(post._id)
            .populate('user', 'name');

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private (protected)
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked the post
        const alreadyLiked = post.likes.find(
            like => like.user.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            // Unlike: remove the like
            post.likes = post.likes.filter(
                like => like.user.toString() !== req.user._id.toString()
            );
        } else {
            // Like: add the like
            post.likes.push({ user: req.user._id });
        }

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('user', 'name')
            .populate('likes.user', 'name')
            .populate('comments.user', 'name');

        res.json(updatedPost);
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private (protected)
router.post('/:id/comment', protect, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Please provide comment text' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            user: req.user._id,
            text
        });

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('user', 'name')
            .populate('likes.user', 'name')
            .populate('comments.user', 'name');

        res.status(201).json(updatedPost);
    } catch (error) {
        console.error('Comment post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


