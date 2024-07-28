const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/ReviewModel');
const User = require('../models/UserModel');
const reviewRoutes = require('../routes/review');
const authMiddleware = require('../middleware/authmiddleware');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());
app.use('/api/reviews', reviewRoutes);

app.use('/api/reviews', (req, res, next) => {
    req.user = { id: 'mockUserId' };
    next();
});

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1w' });
};

describe('Review Routes', () => {
    beforeEach(async () => {
        await Review.deleteMany();
        await User.deleteMany();
    }, 10000);

    it('should add a new review', async () => {
        const user = await new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        }).save();

        const token = generateToken(user.id);

        const response = await request(app)
            .post('/api/reviews')
            .set('x-auth-token', token)
            .send({
                title: 'Great Book',
                author: 'John Doe',
                reviewText: 'This book was fantastic!',
                rating: 5,
            });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Great Book');
    }, 10000);

    it('should get all reviews', async () => {
        const user = await new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        }).save();

        const token = generateToken(user.id);

        await new Review({
            title: 'Another Book',
            author: 'Jane Doe',
            reviewText: 'Not bad!',
            rating: 4,
            userId: user.id,
        }).save();

        const response = await request(app)
            .get('/api/reviews')
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body.reviews.length).toBeGreaterThan(0);
    }, 10000);
});
