import Router from "koa-router";

const router = new Router();

router.all('/websocket/:id', async ctx => {
    let t = setInterval(function() {
      let n = Math.random()
      if(n > 0.3) {
        let msg = JSON.stringify({ 'id': ctx.params.id, 'n': n })
        // @ts-ignore
        ctx.websocket.send(msg)
      }
    }, 1000)
    // @ts-ignore
    ctx.websocket.on('message', msg => {
      console.log('前端发过来的数据：', msg)
    })
    // @ts-ignore
    ctx.websocket.on('close', () => {
      console.log('前端关闭了websocket')
    })
  })
  

export default router;