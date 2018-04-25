'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

  describe('GET /cowsay', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockHtml = `<!DOCTYPE html>
    <html>
      <head>
        <title> cowsay </title>
      </head>
      <body>
        <h1> cowsay </h1>
        <pre>
          ${mockCow}
        </pre>
      </body>
    </html>`;
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get(':5000/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockHtml);
        });
    });
  });

  describe('POST /api/cowsay', () => {
    it('should return status 200 for successful post', () => {
      return superagent.post(':5000/api/cowsay')
        // .set('Content-Type', 'application/json')
        .send({ text: 'judy' })
        .then((res) => {
          expect(res.body.text).toEqual('judy');
          expect(res.status).toEqual(200);
        });
    });
  });
});

describe('INVALID request to the API', () => {
  describe('GET /cowsayPage', () => {
    it('should err out with 400 status code for not sending text in query', () => {
      return superagent.get(':5000/cowsayPage')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});

