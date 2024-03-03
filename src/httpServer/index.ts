import Koa from 'koa';
import koaException from '../middleware/koaException';
import koaCors from 'koa-cors';
import koaBody from 'koa-body';
import router from '../router'
import KoaBouncer from 'koa-bouncer';
import KoaWebsocket from 'koa-websocket';
import logUtil from '../utils/logUtil';
import wsRouter from '../router/wsRouter';
const logger = logUtil("app");

const app = KoaWebsocket(new Koa());

app.use(koaException);
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,
    },
    })).use(KoaBouncer.middleware()).use(koaCors());

app.use(router.routes());

// @ts-ignore
app.ws.use(wsRouter.routes());
app.ws.use((ctx) => {
    // the websocket is added to the context as `ctx.websocket`.
   ctx.websocket.on('message', function(message) {
     logger.info(message);
     ctx.websocket.send('Hello World');
   });
 });

export default app;