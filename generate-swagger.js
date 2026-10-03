const fs = require('fs');

const str = (example) => ({ type: 'string', example });
const num = (example) => ({ type: 'number', example });
const ref = (name) => ({ $ref: '#/definitions/' + name });
const resp = (description, schema) => (schema ? { description, schema } : { description });

function collection(tag, name, plural, input, output) {
    const idParam = [{ name: 'id', in: 'path', required: true, type: 'string', description: name + ' id' }];
    const body = [{ in: 'body', name: 'body', required: true, schema: ref(input) }];
    const list = { type: 'array', items: ref(output) };
    const locked = ' (login required)';
    const bad = resp('Invalid id or validation error');
    const missing = resp('Not found');
    const noLogin = resp('Not logged in');
    const oops = resp('Server error');
    return {
        ['/' + plural]: {
            get: {
                tags: [tag],
                summary: 'Get all ' + plural,
                responses: { 200: resp('List of ' + plural, list), 500: oops }
            },
            post: {
                tags: [tag],
                summary: 'Create a ' + name + locked,
                parameters: body,
                responses: { 201: resp(name + ' created', ref(output)), 400: bad, 401: noLogin, 500: oops }
            }
        },
        ['/' + plural + '/{id}']: {
            parameters: idParam,
            get: {
                tags: [tag],
                summary: 'Get one ' + name,
                responses: { 200: resp('The ' + name, ref(output)), 400: bad, 404: missing, 500: oops }
            },
            put: {
                tags: [tag],
                summary: 'Update a ' + name + locked,
                parameters: body,
                responses: { 200: resp(name + ' updated', ref(output)), 400: bad, 401: noLogin, 404: missing, 500: oops }
            },
            delete: {
                tags: [tag],
                summary: 'Delete a ' + name + locked,
                responses: { 200: resp(name + ' deleted'), 400: bad, 401: noLogin, 404: missing, 500: oops }
            }
        }
    };
}

const courseProps = {
    courseCode: str('CSE341'),
    title: str('Web Services'),
    instructor: str('Brother Smith'),
    semester: str('Fall 2026'),
    credits: num(3),
    meetingDays: { type: 'array', items: { type: 'string' }, example: ['Mon', 'Wed'] },
    meetingTime: str('10:00 AM'),
    location: str('Online')
};

const assignmentProps = {
    courseId: str('PASTE A REAL COURSE _id HERE'),
    title: str('Week 6 Project'),
    description: str('Build four collections with OAuth'),
    dueDate: str('2026-10-10'),
    priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
    status: { type: 'string', enum: ['not started', 'in progress', 'submitted', 'graded'], example: 'in progress' },
    estimatedHours: num(6),
    pointsPossible: num(100),
    grade: num(0)
};

const userProps = {
    githubId: str('12345678'),
    username: str('simon'),
    displayName: str('Simon M'),
    email: str('simon@example.com'),
    role: { type: 'string', enum: ['student', 'admin'], example: 'student' }
};

const noteProps = {
    courseId: str('PASTE A REAL COURSE _id HERE'),
    title: str('Week 6 reading'),
    content: str('OAuth uses GitHub to log users in'),
    tags: { type: 'array', items: { type: 'string' }, example: ['oauth', 'week6'] },
    pinned: { type: 'boolean', example: false }
};

const stamps = {
    createdAt: str('2026-10-03T10:00:00.000Z'),
    updatedAt: str('2026-10-03T10:00:00.000Z')
};

const output = (id, props) => ({ type: 'object', properties: { _id: str(id), ...props, ...stamps } });

const doc = {
    swagger: '2.0',
    info: {
        title: 'Study Planner API',
        description:
            'API for managing courses, assignments, users and notes. GET routes are public. POST, PUT and DELETE routes need login: open /auth/login in the browser first.',
        version: '1.0.0'
    },
    tags: [{ name: 'Auth' }, { name: 'Courses' }, { name: 'Assignments' }, { name: 'Users' }, { name: 'Notes' }],
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
        '/auth/login': {
            get: { tags: ['Auth'], summary: 'Log in with GitHub (open this URL in the browser)', responses: { 302: resp('Redirects to GitHub') } }
        },
        '/auth/logout': {
            get: { tags: ['Auth'], summary: 'Log out', responses: { 200: resp('Logged out') } }
        },
        '/auth/status': {
            get: { tags: ['Auth'], summary: 'Who is logged in', responses: { 200: resp('Login status') } }
        },
        ...collection('Courses', 'course', 'courses', 'CourseInput', 'Course'),
        ...collection('Assignments', 'assignment', 'assignments', 'AssignmentInput', 'Assignment'),
        ...collection('Users', 'user', 'users', 'UserInput', 'User'),
        ...collection('Notes', 'note', 'notes', 'NoteInput', 'Note')
    },
    definitions: {
        CourseInput: { type: 'object', required: ['courseCode', 'title', 'semester'], properties: courseProps },
        Course: output('65f1c2a9e4b0a1b2c3d4e5f6', courseProps),
        AssignmentInput: { type: 'object', required: ['courseId', 'title', 'dueDate'], properties: assignmentProps },
        Assignment: output('65f1c2a9e4b0a1b2c3d4e5f7', assignmentProps),
        UserInput: { type: 'object', required: ['username', 'email'], properties: userProps },
        User: output('65f1c2a9e4b0a1b2c3d4e5f8', userProps),
        NoteInput: { type: 'object', required: ['courseId', 'title', 'content'], properties: noteProps },
        Note: output('65f1c2a9e4b0a1b2c3d4e5f9', noteProps)
    }
};

fs.writeFileSync('swagger.json', JSON.stringify(doc, null, 2));
console.log('swagger.json written with ' + Object.keys(doc.paths).length + ' paths');