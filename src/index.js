import process from 'process';
import Server from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

const PORT = Number(process.env.PORT || 3000);

async function bootstrap() {
  try {
    await initMongoConnection();
    Server.listen(PORT, (error) => {
      if (error) {
        console.error(error.message);
        throw error;
      }
      console.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

bootstrap().catch((error) => console.error(error));
