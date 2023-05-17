import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import axios from 'axios';
import {
	viewsRouter,
	visitorRouter
} from './routers/index.js';


// second minute hour day-of-month month day-of-week
cron.schedule('0 59 23 * * *', async function() {
	const data = await axios.post('http://hmkting.synology.me:3001/api/setLastRank');
});

// second minute hour day-of-month month day-of-week
cron.schedule('0 52 10 * * *', async function() {
	console.log("1")
});

// second minute hour day-of-month month day-of-week
cron.schedule('0 53 23 * * *', async function() {
	console.log("2")
});

// second minute hour day-of-month month day-of-week
cron.schedule('0 54 23 * * *', async function() {
	console.log("3")
});

const app = express();

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

app.use('/api', visitorRouter);

export { app };
