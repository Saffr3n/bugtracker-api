import request from 'supertest';
import app from '../__mocks__/app';
import mockUserModel from '../__mocks__/user-model';
import { createStringOfLength } from '../__utils__';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH
} from '../../src/constants/validation';

mockUserModel();

describe('user router', () => {
  describe('POST /users (create user)', () => {
    it('does not create user without username', (done) => {
      request(app)
        .post('/users')
        .expect(400, /username required/i, done);
    });

    it(`does not create user with username shorter than ${USERNAME_MIN_LENGTH} characters`, (done) => {
      request(app)
        .post('/users')
        .send({ username: createStringOfLength(USERNAME_MIN_LENGTH - 1) })
        .expect(400, /username length error/i, done);
    });

    it(`does not create user with username longer than ${USERNAME_MAX_LENGTH} characters`, (done) => {
      request(app)
        .post('/users')
        .send({ username: createStringOfLength(USERNAME_MAX_LENGTH + 1) })
        .expect(400, /username length error/i, done);
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

    it('does not create user with username that is already in use', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'admin' })
        .expect(400, /username already in use/i, done);
    });

    it('does not create user without email', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test' })
        .expect(400, /email required/i, done);
    });

    it('does not create user with invalid email', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test', email: 'invalid@email' })
        .expect(400, /email invalid/i, done);
    });

    it('does not create user with email that is already in use', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test', email: 'admin@example.com' })
        .expect(400, /email already in use/i, done);
    });

    it('does not create user without password', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test', email: 'test@example.com' })
        .expect(400, /password required/i, done);
    });

    it(`does not create user with password shorter than ${PASSWORD_MIN_LENGTH} characters`, (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: createStringOfLength(PASSWORD_MIN_LENGTH - 1)
        })
        .expect(400, /password too short/i, done);
    });

    it('does not create user with password that does not contain lower case letter', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'TEST1234'
        })
        .expect(400, /password invalid/i, done);
    });

    it('does not create user with password that does not contain upper case letter', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'test1234'
        })
        .expect(400, /password invalid/i, done);
    });

    it('does not create user with password that does not contain number', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'TESTtest'
        })
        .expect(400, /password invalid/i, done);
    });

    it('does not create user with password that does not match confirmation field', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'Test1234'
        })
        .expect(400, /password confirmation error/i, done);
    });

    it('creates user with valid data', (done) => {
      request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'Test1234',
          confirm: 'Test1234'
        })
        .expect(200, /user created/i, done);
    });
  });
});
