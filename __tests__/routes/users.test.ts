import request from 'supertest';
import { ObjectId } from 'mongodb';
import app from '../__mocks__/app';
import mockUserModel from '../__mocks__/user-model';
import mockDb from '../__mocks__/db';
import { createStringOfLength } from '../__utils__';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  LIMIT_MIN_VALUE,
  LIMIT_MAX_VALUE,
  LIMIT_DEFAULT_VALUE,
  PAGE_MIN_VALUE
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
        .expect(400, /username too short/i, done);
    });

    it(`does not create user with username longer than ${USERNAME_MAX_LENGTH} characters`, (done) => {
      request(app)
        .post('/users')
        .send({ username: createStringOfLength(USERNAME_MAX_LENGTH + 1) })
        .expect(400, /username too long/i, done);
    });

    it('does not create user with username that does not start with letter', (done) => {
      request(app)
        .post('/users')
        .send({ username: '7est' })
        .expect(400, /username start error/i, done);
    });

    it('does not create user with username that contains invalid characters', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'te$t' })
        .expect(400, /username invalid characters error/i, done);
    });

    it('does not create user with username that contains consecutive special characters', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'te__st' })
        .expect(400, /username consecutive characters error/i, done);
    });

    it('does not create user with username that does not end with letter or number', (done) => {
      request(app)
        .post('/users')
        .send({ username: 'test_' })
        .expect(400, /username end error/i, done);
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

  describe('GET /users (get all users)', () => {
    it('does not get users with invalid "limit" url parameter', (done) => {
      request(app)
        .get('/users?limit=invalid')
        .expect(400, /limit invalid/i, done);
    });

    it(`does not get users with "limit" url parameter being less than ${LIMIT_MIN_VALUE}`, (done) => {
      request(app)
        .get(`/users?limit=${LIMIT_MIN_VALUE - 1}`)
        .expect(400, /limit too low/i, done);
    });

    it(`does not get users with "limit" url parameter being more than ${LIMIT_MAX_VALUE}`, (done) => {
      request(app)
        .get(`/users?limit=${LIMIT_MAX_VALUE + 1}`)
        .expect(400, /limit too high/i, done);
    });

    it('does not get users with invalid "page" url parameter', (done) => {
      request(app)
        .get('/users?page=invalid')
        .expect(400, /page invalid/i, done);
    });

    it(`does not get users with "page" url parameter being less than ${PAGE_MIN_VALUE}`, (done) => {
      request(app)
        .get(`/users?page=${PAGE_MIN_VALUE - 1}`)
        .expect(400, /page too low/i, done);
    });

    it('does not get users with invalid "sort" url parameter', (done) => {
      request(app)
        .get('/users?sort=invalid')
        .expect(400, /sort invalid/i, done);
    });

    it(`gets ${LIMIT_DEFAULT_VALUE} users without "limit" url parameter`, (done) => {
      request(app)
        .get('/users')
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body.data).toHaveLength(LIMIT_DEFAULT_VALUE);
          return done();
        });
    });

    it('gets users with valid url parameters or without any', (done) => {
      request(app)
        .get('/users')
        .expect(200, /users retrieved/i, done);

      request(app)
        .get('/users?limit=10&page=2&sort=id')
        .expect(200, /users retrieved/i, done);
    });
  });

  describe('GET /users/:userId (get user by id)', () => {
    it('does not get user with invalid userId', (done) => {
      request(app)
        .get('/users/invalid')
        .expect(400, /user id invalid/i, done);
    });

    it('does not get non-existent user', (done) => {
      request(app)
        .get(`/users/${new ObjectId()}`)
        .expect(404, /user not found/i, done);
    });

    it('gets user with valid userId and includes email only if requesting self', (done) => {
      request(app)
        .get(`/users/${mockDb.users[0]!.id}`)
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body.data.email).toBeUndefined();
        });

      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .get(`/users/${mockDb.users[0]!.id}`)
            .set('cookie', cookie)
            .expect(200, (err, res) => {
              if (err) return done(err);
              expect(res.body.data.email).toBeDefined();
              return done();
            });
        });
    });
  });
});
