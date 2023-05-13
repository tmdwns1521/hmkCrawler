import { Router } from 'express';
import { visitorService } from '../services/index.js';
import bcrypt from 'bcrypt';

const visitorRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
visitorRouter.post('/visitor', async (req, res, next) => {
	try {

		// req (request)의 body 에서 데이터 가져오기
		const ip = req.body.ip;
		const referrer = req.body.referrer;
		const browser = req.body.browser;
		const os = req.body.os;


		// 위 데이터를 유저 db에 추가하기
		const newVisitor = await visitorService.visitorAdd({
			ip,
			referrer,
			browser,
			os
		});

		res.status(201).json(newVisitor);
	} catch (error) {
		next(error);
	}
});

visitorRouter.get('/visitor', async (req, res, next) => {
	try {

		// 위 데이터를 유저 db에 추가하기
		const Visitors = await visitorService.visitors();

		res.status(201).json(Visitors);
	} catch (error) {
		next(error);
	}
});

export { visitorRouter };