const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/UserModel');
const authRoutes = require('../routes/auth');
const app = express();

app.use(express.json());
app.use('/api/users', authRoutes);

describe('User Routes', () => {
    beforeEach(async () => {
        await User.deleteMany();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.msg).toBe('User registered');
    });

    it('should not register a user with an existing email', async () => {
        await new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        }).save();

        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'newuser',
                email: 'test@example.com',
                password: 'newpassword123',
            });

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('User already exists');
    });
});
