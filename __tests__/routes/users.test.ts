import request from 'supertest';
import mockMongoStore from '../__mocks__/mongo-store';
import mockUserModel from '../__mocks__/user-model';
import type { Application } from 'express';

describe('user router', () => {
  let app: Application;

  beforeAll(() => {
    mockMongoStore();
    mockUserModel();
    app = require('../../src/configs/app').default;
  });

  describe('POST /users (create user)', () => {
    it('does not create user without username', (done) => {
      request(app)
        .post('/users')
        .expect(400, /username required/i, done);
    });

    it('does not create user with username shorter than 3 characters', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'ab' })
        .expect(400, /username length error/i, done);
    });

    it('does not create user with username longer than 24 characters', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'abcdefghijklmnopqrstuvwxyz' })
        .expect(400, /username length error/i, done);
    });

    it('does not create user with username that does not start with letter', (done) => {
      request(app)
        .post('/users')
        .send({ username: '7est' })
        .expect(400, /username invalid/i, done);
    });

    it('does not create user with username that contains forbidden characters', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'te$t' })
        .expect(400, /username invalid/i, done);
    });

    it('does not create user with username that contains consecutive special characters', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'te__st' })
        .expect(400, /username invalid/i, done);
    });

    it('does not create user with username that ends with special character', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test_' })
        .expect(400, /username invalid/i, done);
    });

    it('does not create user with username that is already in use', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test' })
        .expect(400, /username already in use/i, done);
    });

    it('does not create user without email', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test_2' })
        .expect(400, /email required/i, done);
    });

    it('does not create user with invalid email', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test_2', email: 'invalid@email' })
        .expect(400, /email invalid/i, done);
    });

    it('does not create user with email that is already in use', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test_2', email: 'test@example.com' })
        .expect(400, /email already in use/i, done);
    });

    it('does not create user without password', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test_2', email: 'test_2@example.com' })
        .expect(400, /password required/i, done);
    });

    it('does not create user with password shorter than 8 characters', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test_2',
          email: 'test_2@example.com',
          password: '1234567'
        })
        .expect(400, /password too short/i, done);
    });

    it('does not create user with password that does not contain lower case letter', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test_2',
          email: 'test_2@example.com',
          password: 'TEST1234'
        })
        .expect(400, /password invalid/i, done);
    });

    it('does not create user with password that does not contain upper case letter', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test_2',
          email: 'test_2@example.com',
          password: 'test1234'
        })
        .expect(400, /password invalid/i, done);
    });

    it('does not create user with password that does not contain number', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test_2',
          email: 'test_2@example.com',
          password: 'TESTtest'
        })
        .expect(400, /password invalid/i, done);
    });

    it('does not create user with password that does not match confirmation field', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test_2',
          email: 'test_2@example.com',
          password: 'Test1234'
        })
        .expect(400, /password confirmation error/i, done);
    });

    it('creates user with valid data', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test_2',
          email: 'test_2@example.com',
          password: 'Test1234',
          confirm: 'Test1234'
        })
        .expect(200, /registered/i, done);
    });
  });
});
