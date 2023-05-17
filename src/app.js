import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import axios from 'axios';
import { spawn } from 'child_process';
import {
	viewsRouter,
	visitorRouter
} from './routers/index.js';


// second minute hour day-of-month month day-of-week
cron.schedule('0 59 23 * * *', async function() {
	const data = await axios.post('http://hmkting.synology.me:3001/api/setLastRank');
});


// second minute hour day-of-month month day-of-week
cron.schedule('0 0 9 * * *', async function() {
	const result = spawn('python', ['placeUpdate.py']);
	// 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
	result.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	// 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
	result.stderr.on('data', function (data) {
		console.log(data.toString());
	});
});

// second minute hour day-of-month month day-of-week
cron.schedule('0 0 15 * * *', async function() {
	const result = spawn('python', ['placeUpdate.py']);
	// 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
	result.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	// 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
	result.stderr.on('data', function (data) {
		console.log(data.toString());
	});
});

// second minute hour day-of-month month day-of-week
cron.schedule('0 0 18 * * *', async function() {
	const result = spawn('python', ['placeUpdate.py']);
	// 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
	result.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	// 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
	result.stderr.on('data', function (data) {
		console.log(data.toString());
	});
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
