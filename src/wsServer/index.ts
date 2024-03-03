import ws from 'ws';

export default class WebSocketServer {
    private wss: ws.Server;
    constructor(server: any) {
        this.wss = new ws.Server({ server });
        this.wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                console.log('received: %s', message);
            });
            ws.send('something');
        });
    }

}