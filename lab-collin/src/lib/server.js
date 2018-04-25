'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');
const faker = require('faker');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      // 1. First thing we need to is write status head to headers
      // 2. Next, we write response body
      // 3. Finally, we need to END the response

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === `/`) {
        res.writeHead(200, { 'Content-Type': 'text/html' });   
        res.write(`<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
           <header>
             <nav>
               <ul>
                 <li><a href="/cowsay">cowsay</a></li>
               </ul>
             </nav>
           <header>
           <main>
             This project is about returning a cowsay of user text.
             <p>Use &text=yourmessage and &cow=cowtype in the URL.
             an example of a cow type is: dragon.</p>
           </main>
          </body>
        </html>`
          );
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === `/cowsay`) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (parsedRequest.url.query.text === ''){
          parsedRequest.url.query.text = faker.internet.userName();
        }
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text, cow: parsedRequest.url.query.cow });
        res.write(`<!DOCTYPE html>
          <html>
            <head>
              <title> cowsay </title>
            </head>
            <body>
              <h1> cowsay </h1>
              <pre>
                ${cowsayText}
              </pre>
            </body>
          </html>`
          );
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(JSON.stringify({'content': `${cowsayText}`}));
        if (parsedRequest.url.query.text === ''){
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('invalid request: text query required');
          res.end();
          return undefined;
        }
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/api/cowsay') {
        if (!parsedRequest.body) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write(JSON.stringify({'error': 'invalid request, body required'}));
        }
        if (!parsedRequest.body.text) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write(JSON.stringify({'error': 'invalid request, text required'}));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const cowsayText = cowsay.say({ text: parsedRequest.body.text });
        res.write(JSON.stringify({'content': `${cowsayText}`}));
        res.end();
        return undefined;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })
    .catch((err) => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('BAD REQUEST', err);
      res.end();
      return undefined;
    });
});

server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);

