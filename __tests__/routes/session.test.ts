import request from 'supertest';
import mockMongoStore from '../__mocks__/mongo-store';
import mockUserModel from '../__mocks__/user-model';
import type { Application } from 'express';

describe('session router', () => {
  let app: Application;

  beforeAll(() => {
    mockMongoStore();
    mockUserModel();
    app = require('../../src/configs/app').default;
  });

  describe('POST /session (login)', () => {
    it('does not log in non-existent user', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'non-existent-user', password: 'Test1234' })
        .expect(401, /login error/i, done);
    });

    it('logs in existent user', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'test', password: 'Test1234' })
        .expect(200, /logged in/i, done);
    });
  });

  describe('DELETE /session (logout)', () => {
    it('logs out user with active session', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'test', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .delete('/session')
            .set('cookie', cookie)
            .expect(200, /logged out/i, done);
        });
    });

    it('works without active session', (done) => {
      request(app)
        .delete('/session')
        .expect(200, /logged out/i, done);
    });
  });
});
