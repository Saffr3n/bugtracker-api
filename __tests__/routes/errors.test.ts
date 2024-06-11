import request from 'supertest';
import { PathNotFoundError } from '../../src/utils/errors';
import mockMongoStore from '../__mocks__/mongo-store';
import type { Application } from 'express';

describe('GET /errors/:name (get error info by its name)', () => {
  let app: Application;

  beforeAll(() => {
    mockMongoStore();
    app = require('../../src/configs/app').default;
  });

  it('responds with 404 if error not found', (done) => {
    request(app)
      .get('/errors/non-existing-error')
      .expect(404, /path not found/i, done);
  });

  it('responds with correct error info if error exists', (done) => {
    const err = new PathNotFoundError();
    const { status, title, detail } = err;
    const html =
      `<h1>${title}</h1>\n` + `<h2>${status}</h2>\n` + `<p>${detail}</p>`;

    request(app).get('/errors/path-not-found').expect(200, html, done);
  });
});
