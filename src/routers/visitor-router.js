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
		const todayNotSql = `delete from company_ranking_data where count != ? and created_at BETWEEN "${now} 00:00:00" AND "${now} 23:59:59"`
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

visitorRouter.post('/createPlace', async (req, res, next) => {
	try {
		function getDatesStartToLast(startDate, lastDate) {
			var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
			if(!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
			var result = [];
			var curDate = new Date(startDate);
			while(curDate <= new Date(lastDate)) {
				result.push(curDate.toISOString().split("T")[0]);
				curDate.setDate(curDate.getDate() + 1);
			}
			return result;
		}
		const { guaranteedRank, companyNum, keyword, companyName, companyNumber, companyPhone, companyCode, status } = req.body;
		const sql = `INSERT INTO company_ranking (guaranteed_rank, business_number, keywords, company_name, company_number, company_phone, company_code, status, businessType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
		await mysqlWrite.query(sql, [ guaranteedRank, companyNum, keyword, companyName, companyNumber, companyPhone, companyCode, status, 'place']);
		let now = '';
		let OneMonth = '';
		const offset = 1000 * 60 * 60 * 9
		const today = new Date((new Date()).getTime() + offset);
		now = today.toISOString().split('T')[0];
		today.setMonth(today.getMonth() - 1);
		OneMonth = today.toISOString().split('T')[0];
		const dateData = getDatesStartToLast(OneMonth, now)
		dateData.forEach(async (e) => {
			const newSql = `INSERT INTO company_ranking_data (created_at, rank, keyword, code) VALUES (?, ?, ?, ?)`
			await mysqlWrite.query(newSql, [e, '0', keyword, companyCode]) 
		})
		res.status(201).json({"result": "ok"});
	} catch (error) {
		next(error);
	}
});

export { visitorRouter };