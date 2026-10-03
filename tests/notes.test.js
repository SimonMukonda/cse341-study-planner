const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Course = require('../models/course');
const Note = require('../models/note');

let courseId;
let noteId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const course = await Course.create({
        courseCode: 'TEST103',
        title: 'Unit Test Course for Notes',
        semester: 'Test 2026'
    });
    courseId = course._id.toString();
    const note = await Note.create({
        courseId,
        title: 'Unit Test Note',
        content: 'Content for the unit test note'
    });
    noteId = note._id.toString();
});

afterAll(async () => {
    await Note.findByIdAndDelete(noteId);
    await Course.findByIdAndDelete(courseId);
    await mongoose.connection.close();
});

describe('GET /notes', () => {
    test('returns 200 and an array', async () => {
        const res = await request(app).get('/notes');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('includes the test note', async () => {
        const res = await request(app).get('/notes');
        const ids = res.body.map((n) => n._id);
        expect(ids).toContain(noteId);
    });
});

describe('GET /notes/:id', () => {
    test('returns 200 and the note for a valid id', async () => {
        const res = await request(app).get('/notes/' + noteId);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Unit Test Note');
    });

    test('returns 400 for an invalid id', async () => {
        const res = await request(app).get('/notes/123');
        expect(res.statusCode).toBe(400);
    });

    test('returns 404 for an id that does not exist', async () => {
        const res = await request(app).get('/notes/65f1c2a9e4b0a1b2c3d4e5f0');
        expect(res.statusCode).toBe(404);
    });
});