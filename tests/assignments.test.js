const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Course = require('../models/course');
const Assignment = require('../models/assignment');

let courseId;
let assignmentId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const course = await Course.create({
        courseCode: 'TEST102',
        title: 'Unit Test Course for Assignments',
        semester: 'Test 2026'
    });
    courseId = course._id.toString();
    const assignment = await Assignment.create({
        courseId,
        title: 'Unit Test Assignment',
        dueDate: new Date('2026-12-01')
    });
    assignmentId = assignment._id.toString();
});

afterAll(async () => {
    await Assignment.findByIdAndDelete(assignmentId);
    await Course.findByIdAndDelete(courseId);
    await mongoose.connection.close();
});

describe('GET /assignments', () => {
    test('returns 200 and an array', async () => {
        const res = await request(app).get('/assignments');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('includes the test assignment', async () => {
        const res = await request(app).get('/assignments');
        const ids = res.body.map((a) => a._id);
        expect(ids).toContain(assignmentId);
    });
});

describe('GET /assignments/:id', () => {
    test('returns 200 and the assignment for a valid id', async () => {
        const res = await request(app).get('/assignments/' + assignmentId);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Unit Test Assignment');
    });

    test('returns 400 for an invalid id', async () => {
        const res = await request(app).get('/assignments/123');
        expect(res.statusCode).toBe(400);
    });

    test('returns 404 for an id that does not exist', async () => {
        const res = await request(app).get('/assignments/65f1c2a9e4b0a1b2c3d4e5f0');
        expect(res.statusCode).toBe(404);
    });
});