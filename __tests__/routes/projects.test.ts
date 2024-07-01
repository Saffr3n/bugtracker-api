import request from 'supertest';
import app from '../__mocks__/app';
import mockDb from '../__mocks__/db';
import mockUserModel from '../__mocks__/user-model';
import mockProjectModel from '../__mocks__/project-model';
import { createStringOfLength } from '../__utils__';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH,
  LIMIT_MIN_VALUE,
  LIMIT_MAX_VALUE,
  LIMIT_DEFAULT_VALUE,
  PAGE_MIN_VALUE
} from '../../src/constants/validation';

describe('projects router', () => {
  beforeEach(() => {
    const db = mockDb();
    mockUserModel(db);
    mockProjectModel(db);
  });

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
              title: 'Test Project',
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
              title: 'Test Project',
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
            .send({ title: 'Test Project' })
            .expect(200, /project created/i, done);
        });
    });
  });

  describe('GET /projects (get all projects)', () => {
    it('does not get projects with invalid "limit" url parameter', (done) => {
      request(app)
        .get('/projects?limit=invalid')
        .expect(400, /limit invalid/i, done);
    });

    it(`does not get projects with "limit" url parameter being less than ${LIMIT_MIN_VALUE}`, (done) => {
      request(app)
        .get(`/projects?limit=${LIMIT_MIN_VALUE - 1}`)
        .expect(400, /limit too low/i, done);
    });

    it(`does not get projects with "limit" url parameter being more than ${LIMIT_MAX_VALUE}`, (done) => {
      request(app)
        .get(`/projects?limit=${LIMIT_MAX_VALUE + 1}`)
        .expect(400, /limit too high/i, done);
    });

    it('does not get projects with invalid "page" url parameter', (done) => {
      request(app)
        .get('/projects?page=invalid')
        .expect(400, /page invalid/i, done);
    });

    it(`does not get projects with "page" url parameter being less than ${PAGE_MIN_VALUE}`, (done) => {
      request(app)
        .get(`/projects?page=${PAGE_MIN_VALUE - 1}`)
        .expect(400, /page too low/i, done);
    });

    it('does not get projects with invalid "sort" url parameter', (done) => {
      request(app)
        .get('/projects?sort=invalid')
        .expect(400, /sort invalid/i, done);
    });

    it(`gets ${LIMIT_DEFAULT_VALUE} projects without "limit" url parameter`, (done) => {
      request(app)
        .get('/projects')
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body.data).toHaveLength(LIMIT_DEFAULT_VALUE);
          done();
        });
    });

    it('gets projects with valid url parameters', (done) => {
      request(app)
        .get('/projects?limit=10&page=2&sort=id')
        .expect(200, /projects retrieved/i, done);
    });

    it('gets projects without url parameters', (done) => {
      request(app)
        .get('/projects')
        .expect(200, /projects retrieved/i, done);
    });
  });
});
