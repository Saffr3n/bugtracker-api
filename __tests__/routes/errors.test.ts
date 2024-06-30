import request from 'supertest';
import app from '../__mocks__/app';

describe('GET /errors/:errorName (get error info by its name)', () => {
  it('responds with 404 if error not found', (done) => {
    request(app)
      .get('/errors/non-existing-error')
      .expect(404, /path not found/i, done);
  });

  it('responds with correct error info if error exists', (done) => {
    request(app)
      .get('/errors/path-not-found')
      .expect(200, /path not found/i, done);
  });
});
