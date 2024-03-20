import Router = require("koa-router")
const MediaWsRouter = new Router()

// MediaWsRouter.all('/websocket/:id', async ctx => {
//     let t = setInterval(function() {
//       let n = Math.random()
//       if(n > 0.3) {
//         let msg = JSON.stringify({ 'id': ctx.params.id, 'n': n })
//         ctx.ws.send(msg)
//       }
//     }, 1000)
//     ctx.ws.on('message', msg => {
//       console.log('前端发过来的数据：', msg)
//     })
//     ctx.ws.on('close', () => {
//       console.log('前端关闭了websocket')
//     })
//   })

export default MediaWsRouter
  