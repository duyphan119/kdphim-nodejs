import express from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes/index.route';
import { errorHandler } from './middlewares/error-handler.middleware';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  }),
);
app.use(express.json());
app.use(rootRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
