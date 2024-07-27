const express = require('express');
const Review = require('../models/ReviewModel');
const auth = require('../middleware/authmiddleware');
const UserModel = require('../models/UserModel');
const router = express.Router();

// Add Review
router.post('/', auth, async (req, res) => {
    const { title, author, reviewText, rating } = req.body;
    try {
        const review = new Review({ title, author, reviewText, rating, userId: req.user.id });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get Reviews
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    try {
        const totalReviews = await Review.countDocuments();
        const totalPages = Math.ceil(totalReviews / limit);

        const reviews = await Review.find()
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.status(200).json({
            reviews,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});




router.get('/user', auth, async (req, res) => {
    try {
        // Fetch user details
        const user = await UserModel.findById(req.user.id).select('-password');

        // Fetch user reviews
        const reviews = await Review.find({ userId: req.user.id });

        // Combine user info and reviews in the response
        res.status(200).json({ user, reviews });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Edit Review
router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review || review.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedReview);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete Review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review || review.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;
