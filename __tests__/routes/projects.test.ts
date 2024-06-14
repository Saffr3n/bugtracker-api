import request from 'supertest';
import app from '../__mocks__/app';
import mockUserModel from '../__mocks__/user-model';
import mockProjectModel from '../__mocks__/project-model';

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

    it('does not create project with title shorter than 3 characters', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'ab' })
            .expect(400, /title length error/i, done);
        });
    });

    it('does not create project with title longer than 24 characters', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'abcdefghijklmnopqrstuvwxyz' })
            .expect(400, /title length error/i, done);
        });
    });

    it('does not create project with title that contains forbidden characters', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'Test$Project' })
            .expect(400, /title invalid/i, done);
        });
    });

    it('does not create project with title that contains consecutive special characters', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'Test__Project' })
            .expect(400, /title invalid/i, done);
        });
    });

    it('does not create project with title that is already in use', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'Test Project' })
            .expect(400, /title already in use/i, done);
        });
    });

    it('does not create project with description longer than 1024 characters', (done) => {
      const description = (() => {
        let val = '';
        for (let i = 0; i <= 1024; i++) {
          val += 'a';
        }
        return val;
      })();

      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/projects')
            .set('cookie', cookie)
            .send({ title: 'Test Project 2', description })
            .expect(400, /description too long/i, done);
        });
    });

    it('creates project with description up to 1024 (inclusive) characters in length', (done) => {
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
              description: 'Test description...'
            })
            .expect(200, /project created/i, done);
        });
    });

    it('creates project without description', (done) => {
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
