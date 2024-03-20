import { createClient } from 'redis';
import logUtil from '../utils/logUtil';
const logger = logUtil('Redis');

const client = createClient({
    url: "redis://127.0.0.1:16379"
});

client.on('error', (err) => {
    logger.error('Redis error:', err);
});
export default client;
