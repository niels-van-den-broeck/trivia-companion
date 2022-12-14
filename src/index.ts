import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import registerRoutes from './api';

dotenv.config();

const app = express();
const port = process.env.PORT;

/** middlewares */
app.use(cors());
app.use(bodyParser.json());

/** routing */
const router = express.Router();

registerRoutes(router);

app.use('/api', router);

app.route('/api/*').all((req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
