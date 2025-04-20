import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Error de conexión a Redis:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Conexión a Redis establecida con éxito');
  } catch (error) {
    console.error('No se pudo conectar a Redis:', error);
  }
})();

export default redisClient;