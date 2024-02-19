import Koa from 'koa';
import koaException from '../middleware/koaException';
import koaCors from 'koa-cors';
import koaBody from 'koa-body';
import router from '../router'
import KoaBouncer from 'koa-bouncer';

const app = new Koa();

app.use(koaException);
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,
    },
    })).use(KoaBouncer.middleware()).use(koaCors());

app.use(router.routes());

export default app;