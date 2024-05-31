const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('=== TEST USER API ===', () => {
  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(1);
    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password',
    };

    await supertest(app)
      .post('/api/users')
      .send(newUser);

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username must be unique');

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(1);
  });

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const newUser = {
      username: 'te',
      name: 'Test User',
      password: 'password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username must be at least 3 characters long');

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(0);
  });

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'pw',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Password must be at least 3 characters long');

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});