const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   PUT /api/users/:id/follow
// @desc    Follow or unfollow a user
// @access  Private (protected)
router.put('/:id/follow', protect, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        // Check if already following
        const isFollowing = currentUser.following.includes(req.params.id);

        if (isFollowing) {
            // Unfollow: remove from following and followers
            currentUser.following = currentUser.following.filter(
                id => id.toString() !== req.params.id
            );
            userToFollow.followers = userToFollow.followers.filter(
                id => id.toString() !== req.user._id.toString()
            );
        } else {
            // Follow: add to following and followers
            currentUser.following.push(req.params.id);
            userToFollow.followers.push(req.user._id);
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({
            message: isFollowing ? 'User unfollowed' : 'User followed',
            following: currentUser.following,
            followers: userToFollow.followers
        });
    } catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


