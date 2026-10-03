const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

let userId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.create({
        username: 'unittestuser',
        email: 'unittest@example.com'
    });
    userId = user._id.toString();
});

afterAll(async () => {
    await User.findByIdAndDelete(userId);
    await mongoose.connection.close();
});

describe('GET /users', () => {
    test('returns 200 and an array', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('includes the test user', async () => {
        const res = await request(app).get('/users');
        const ids = res.body.map((u) => u._id);
        expect(ids).toContain(userId);
    });
});

describe('GET /users/:id', () => {
    test('returns 200 and the user for a valid id', async () => {
        const res = await request(app).get('/users/' + userId);
        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe('unittestuser');
    });

    test('returns 400 for an invalid id', async () => {
        const res = await request(app).get('/users/123');
        expect(res.statusCode).toBe(400);
    });

    test('returns 404 for an id that does not exist', async () => {
        const res = await request(app).get('/users/65f1c2a9e4b0a1b2c3d4e5f0');
        expect(res.statusCode).toBe(404);
    });
});