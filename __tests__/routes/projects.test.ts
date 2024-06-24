import request from 'supertest';
import app from '../__mocks__/app';
import mockUserModel from '../__mocks__/user-model';
import mockProjectModel from '../__mocks__/project-model';
import { createStringOfLength } from '../__utils__';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH
} from '../../src/constants/validation';

mockUserModel();
mockProjectModel();

describe('projects router', () => {
  describe('POST /projects (create project)', () => {
    it('does not create project without active session', (done) => {
      request(app)
        .post('/projects')
        .expect(401, /unauthenticated/i, done);
    });

    it('does not create project without enough permission', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'user_1', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .expect(403, /access denied/i, done);
        });
    });

    it('does not create project without title', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .expect(400, /title required/i, done);
        });
    });

    it(`does not create project with title shorter than ${TITLE_MIN_LENGTH} characters`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: createStringOfLength(TITLE_MIN_LENGTH - 1) })
            .expect(400, /title too short/i, done);
        });
    });

    it(`does not create project with title longer than ${TITLE_MAX_LENGTH} characters`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: createStringOfLength(TITLE_MAX_LENGTH + 1) })
            .expect(400, /title too long/i, done);
        });
    });

    it(`does not create project with detail longer than ${DETAIL_MAX_LENGTH} characters`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({
              title: 'Test Project 2',
              detail: createStringOfLength(DETAIL_MAX_LENGTH + 1)
            })
            .expect(400, /detail too long/i, done);
        });
    });

    it(`creates project with detail up to ${DETAIL_MAX_LENGTH} characters long`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({
              title: 'Test Project 2',
              detail: createStringOfLength(DETAIL_MAX_LENGTH)
            })
            .expect(200, /project created/i, done);
        });
    });

    it('creates project without detail', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'Test Project 3' })
            .expect(200, /project created/i, done);
        });
    });
  });
});
