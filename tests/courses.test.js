const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Course = require('../models/course');

let courseId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const course = await Course.create({
        courseCode: 'TEST101',
        title: 'Unit Test Course',
        semester: 'Test 2026'
    });
    courseId = course._id.toString();
});

afterAll(async () => {
    await Course.findByIdAndDelete(courseId);
    await mongoose.connection.close();
});

describe('GET /courses', () => {
    test('returns 200 and an array', async () => {
        const res = await request(app).get('/courses');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('includes the test course', async () => {
        const res = await request(app).get('/courses');
        const ids = res.body.map((c) => c._id);
        expect(ids).toContain(courseId);
    });
});

describe('GET /courses/:id', () => {
    test('returns 200 and the course for a valid id', async () => {
        const res = await request(app).get('/courses/' + courseId);
        expect(res.statusCode).toBe(200);
        expect(res.body.courseCode).toBe('TEST101');
    });

    test('returns 400 for an invalid id', async () => {
        const res = await request(app).get('/courses/123');
        expect(res.statusCode).toBe(400);
    });

    test('returns 404 for an id that does not exist', async () => {
        const res = await request(app).get('/courses/65f1c2a9e4b0a1b2c3d4e5f0');
        expect(res.statusCode).toBe(404);
    });
});