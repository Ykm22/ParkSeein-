const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const { jwtConfig, timingLogger, exceptionHandler } = require('./utils.js');
// const WebSocket = require('ws');
const { WebSocketServer } = require('ws');

const { parksRouter } = require('./parks.js');
const { authRouter } = require('./auth.js');

const { initWss } = require('./wss.js');

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocketServer({ server });
initWss(wss);

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = '/api';

// public
const publicApiRouter = new Router({ prefix });
publicApiRouter.use('/auth', authRouter.routes());
app
    .use(publicApiRouter.routes())
    .use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

// protected
const protectedApiRouter = new Router({ prefix });
protectedApiRouter.use('/parks', parksRouter.routes());
app
    .use(protectedApiRouter.routes())
    .use(protectedApiRouter.allowedMethods());

// app.use(async (ctx, next) => {
//     const start = new Date();
//     await next();
//     const ms = new Date() - start;
//     console.log(`${ctx.method} ${ctx.url} ${ctx.response.status} - ${ms}ms`);
// });
  
// app.use(async (ctx, next) => {
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     await next();
// });

// app.use(async (ctx, next) => {
//     try {
//         await next();
//     } catch (err) {
//         ctx.response.body = { issue: [{ error: err.message || 'Unexpected error' }] };
//         ctx.response.status = 500;
//     }
// });


// const Park = require('./Park');
// const parks = [];
// for (let i = 0; i < 10; i++){
//     parks.push(new Park({
//         id: `${i}`, 
//         description: `Park number ${i}`,
//         squared_kms: 50,
//         last_review: new Date(Date.now() + i),
//         reaches_eco_target: Math.random() < 0.5,
//     }));
// }
// let lastId = parks[parks.length - 1].id;

// const broadcast = data =>
//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//         }
//     });

// const router = new Router();

// router.get('/parks', ctx => {
//     ctx.response.body = parks;
//     ctx.response.status = 200;
// });

// const createPark = async (ctx) => {
//     const park = ctx.request.body;
//     if(!park.description) {
//         ctx.response.body = { message: 'Description is missing' };
//         ctx.response.status = 400;
//         return;
//     }
//     console.log("createPark ctx " + ctx);
//     park.id = `${parseInt(lastId) + 1}`;
//     lastId = park.id;
//     parks.push(park);
//     ctx.response.body = park;
//     ctx.response.status = 201;
//     broadcast({ event: 'created', payload: { park }});
// }

// router.post('/parks', async (ctx) => {
//     await createPark(ctx);
// });

// router.put('/parks/:id', async (ctx) => {
//     const id = ctx.params.id;
//     const park = ctx.request.body;
//     console.log(park);
//     const parkId = park.id;
//     if (parkId && id !== park.id) {
//         ctx.response.body = { message: `Param id and body id should be the same` };
//         ctx.response.status = 400;
//         return;
//     }
//     if (!parkId) {
//         await createPark(ctx);
//         return;

//     }
//     const index = parks.findIndex(park => park.id === id);
//     if (index === -1) {
//         ctx.response.body = { issue: [{ error: `item with id ${id} not found`}]};
//         ctx.response.status = 400;
//         return;
//     }
//     parks[index] = park;
//     ctx.response.body = park;
//     ctx.response.status = 200;
//     broadcast({ event: 'updated', payload: {park}});
// })

// app.use(router.routes());
// app.use(router.allowedMethods());

const port = 3000;
console.log(`Running on port: ${port}`);
server.listen(port);