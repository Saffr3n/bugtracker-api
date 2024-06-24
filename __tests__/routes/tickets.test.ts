import request from 'supertest';
import mongoose from 'mongoose';
import app from '../__mocks__/app';
import mockDb from '../__mocks__/db';
import mockUserModel from '../__mocks__/user-model';
import mockProjectModel from '../__mocks__/project-model';
import mockTicketModel from '../__mocks__/ticket-model';
import { createStringOfLength } from '../__utils__';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH
} from '../../src/constants/validation';

mockUserModel();
mockProjectModel();
mockTicketModel();

describe('tickets router', () => {
  describe('POST /tickets (create ticket)', () => {
    it('does not create ticket without active session', (done) => {
      request(app)
        .post('/tickets')
        .expect(401, /unauthenticated/i, done);
    });

    it('does not create ticket without type', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .expect(400, /ticket type required/i, done);
        });
    });

    it('does not create ticket with invalid type', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({ type: 'invalid' })
            .expect(400, /ticket type invalid/i, done);
        });
    });

    it('does not create ticket without priority', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({ type: 'issue' })
            .expect(400, /ticket priority required/i, done);
        });
    });

    it('does not create ticket with invalid priority', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({ type: 'issue', priority: 'invalid' })
            .expect(400, /ticket priority invalid/i, done);
        });
    });

    it('does not create ticket without title', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({ type: 'issue', priority: 'high' })
            .expect(400, /title required/i, done);
        });
    });

    it(`does not create ticket with title shorter than ${TITLE_MIN_LENGTH} characters`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: createStringOfLength(TITLE_MIN_LENGTH - 1)
            })
            .expect(400, /title too short/i, done);
        });
    });

    it(`does not create ticket with title longer than ${TITLE_MAX_LENGTH} characters`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: createStringOfLength(TITLE_MAX_LENGTH + 1)
            })
            .expect(400, /title too long/i, done);
        });
    });

    it('does not create ticket without detail', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: 'Test Ticket'
            })
            .expect(400, /detail required/i, done);
        });
    });

    it(`does not create ticket with detail longer than ${DETAIL_MAX_LENGTH} characters`, (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: 'Test Ticket',
              detail: createStringOfLength(DETAIL_MAX_LENGTH + 1)
            })
            .expect(400, /detail too long/i, done);
        });
    });

    it('does not create ticket with invalid project id', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: 'Test Ticket',
              detail: 'Test detail...',
              project: 'invalid'
            })
            .expect(400, /project id invalid/i, done);
        });
    });

    it('does not create ticket with project id referencing non-existing project', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: 'Test Ticket',
              detail: 'Test detail...',
              project: new mongoose.Types.ObjectId()
            })
            .expect(404, /project not found/i, done);
        });
    });

    it('creates ticket with valid data', (done) => {
      request(app)
        .post('/session')
        .send({ username: 'admin', password: 'Test1234' })
        .then((res) => {
          const cookie = res.headers['set-cookie'] || '';
          request(app)
            .post('/tickets')
            .set('cookie', cookie)
            .send({
              type: 'issue',
              priority: 'high',
              title: 'Test Ticket',
              detail: 'Test detail...',
              project: mockDb.projects[0]!.id
            })
            .expect(200, /ticket created/i, done);
        });
    });
  });
});
