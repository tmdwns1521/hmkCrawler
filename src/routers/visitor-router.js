import { Router } from 'express';
import { mysqlRead } from '../config/mysql_read.js';
import { mysqlWrite } from '../config/mysql_write.js';

const visitorRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
visitorRouter.post('/setLastRank', async (req, res, next) => {
	try {
		const offset = 1000 * 60 * 60 * 9
		const today = new Date((new Date()).getTime() + offset);
		const now = today.toISOString().split('T')[0];
		const todaySql = `select * from company_ranking_data where created_at BETWEEN "${now} 00:00:00" AND "${now} 23:59:59" order by count desc`
		const data = await mysqlRead.query(todaySql);
		const todayNotSql = `delete from company_ranking_data where count != ?`
		const todayNotSqlData = await mysqlWrite.query(todayNotSql, [ data[0][0].count ]);
		res.status(201).json(todayNotSqlData[0]);
	} catch (error) {
		next(error);
	}
});

visitorRouter.post('/getPlace', async (req, res, next) => {
	try {
		const { status } = req.body;
		let now = '';
		let OneMonth = '';
		const offset = 1000 * 60 * 60 * 9
		const today = new Date((new Date()).getTime() + offset);
		// today.setDate(today.getDate() + 1);
		now = today.toISOString().split('T')[0];
		today.setMonth(today.getMonth() - 1);
		OneMonth = today.toISOString().split('T')[0];
		console.log(now)
		console.log(OneMonth)
		const sql = `select cr.*, crd.rank, crd.rate, crd.ids, crd.keyword, crd.created_at from company_ranking cr left join company_ranking_data crd on cr.company_code = crd.code and cr.keywords = crd.keyword where cr.status = ? and crd.created_at BETWEEN "${OneMonth} 00:00:00" AND "${now} 23:59:59" order by crd.ids desc`;
		console.log(sql);
		const datas = await mysqlRead.query(sql, [ status ]);
		res.status(201).json(datas[0]);
	} catch (error) {
		next(error);
	}
});

export { visitorRouter };