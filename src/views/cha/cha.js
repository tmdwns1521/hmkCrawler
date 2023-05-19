
import * as Api from '/api.js';

function downloadExcelFile(data, filename) {
    const csvContent = "data:text/csv;charset=utf-8," + data.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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

window.onload = async function () {
    let params = window.location.href;
    params = params.split("/");
    const status = params[params.length - 2];
    const query = {
        status: status,
    }
    // let postData = await Api.post('http://localhost:3001/api/getPlace', query);
    let postData = await Api.post('http://hmkting.synology.me:3001/api/getPlace', query);
    postData = await postData.reduce((prev, next) => {
        let key = next['id']
        if (!prev[key]) {
            prev[key] = {}
            prev[key]['guaranteed_rank'] = next['guaranteed_rank']
            prev[key]['company_name'] = next['company_name']
            prev[key]['company_number'] = next['company_number']
            prev[key]['company_phone'] = next['company_phone']
            prev[key]['company_code'] = next['company_code']
            prev[key]['business_number'] = next['business_number']
            prev[key]['guaranteed_rank'] = next['guaranteed_rank']
            prev[key]['keyword'] = next['keyword']
            prev[key]['rank_data'] = []
        }
        prev[key]['rank_data'].push({ rank: next['rank'], created_at: next['created_at'], rate: next['rate']})
        return prev
    }, {})

    const plcaeList = document.getElementById('place_list')
    let dateList = {};
    for (const pd in postData) {
        let rankDiv = '';
        postData[pd]['rank_data'].forEach((e) => {
            rankDiv += `<td style="color: ${e.rate}">${e.rank}</td>`
            if (dateList[e.created_at.split(" ")[0]] === undefined) {
                dateList[e.created_at.split(" ")[0]] = 0
            };
            dateList[e.created_at.split(" ")[0]] += Number(e.rank)
        });
        const data = `<tr>
            <td>${postData[pd]['guaranteed_rank']}</td>
            <td>${postData[pd]['business_number']}</td>
            <td>${postData[pd]['keyword']}</td>
            <td>${postData[pd]['company_name']}</td>
            <td>${postData[pd]['company_number']}</td>
            <td>${postData[pd]['company_phone']}</td>
            <td><a href=https://map.naver.com/v5/search/${postData[pd]['keyword']}/place/${postData[pd]['company_code']} target="_blank">${postData[pd]['company_code']}</a></td>
            ${rankDiv}
        </tr>`
        plcaeList.innerHTML += data;
      }
    const placeListTr = document.getElementById('place_list_tr')
    let dataListStr = '';
    for (const da in dateList) {
        dataListStr += `<th>${da} (${dateList[da]})</th>`
    }
    placeListTr.innerHTML += dataListStr
}

const checkBtn = document.getElementById('checkBtn');
checkBtn.addEventListener('click', async (e) => {
    // await Api.post('http://localhost:3001/api/setLastRank');
    await Api.post('http://hmkting.synology.me:3001/api/setLastRank');
    window.location.reload();
})

const checkBtn2 = document.getElementById('checkBtn2');
checkBtn2.addEventListener('click', async (e) => {
    const modalWrap = document.getElementById('modalWrap');
    modalWrap.style.display = 'block';
})

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', async (e) => {
    const modalWrap = document.getElementById('modalWrap');
    modalWrap.style.display = 'none';
})

const createBtn = document.getElementById('createBtn');
createBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const guaranteedRank = document.getElementById('guaranteedRank').value;
    const companyNum = document.getElementById('companyNum').value;
    const keyword = document.getElementById('keyword').value;
    const companyName = document.getElementById('companyName').value;
    const companyNumber = document.getElementById('companyNumber').value;
    const companyPhone = document.getElementById('companyPhone').value;
    const companyCode = document.getElementById('companyCode').value;
    const status = document.getElementById('status').value;
    const data = {
        guaranteedRank,
        companyNum,
        keyword,
        companyName,
        companyNumber,
        companyPhone,
        companyCode,
        status
    }
    // await Api.post('http://localhost:3001/api/createPlace', data);
    await Api.post('http://hmkting.synology.me:3001/api/createPlace', data);
    window.location.reload();
})

const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const code = document.getElementById('placeCode').value.trim();
    const data = {
        start,
        end,
        code
    }
    

    const datas = [];

    const dateDatas = getDatesStartToLast(start, end)
    dateDatas.reverse();
    dateDatas.unshift('키워드')
    datas.push(dateDatas);


    // const Newdata = await Api.post('http://localhost:3001/api/getPlaceDate', data);
    const Newdata = await Api.post('http://hmkting.synology.me:3001/api/getPlaceDate', data);


    const keyword_name = {}
    for (const i of Newdata) {
        try {
            keyword_name[i.keyword].push(i.rank);
        } catch (e) {
            keyword_name[i.keyword] = [];
            keyword_name[i.keyword].push(i.keyword);
            keyword_name[i.keyword].push(i.rank);
        }
    }
    for (const i in keyword_name) {
        datas.push(keyword_name[i]);
    }
    console.log(datas);
    
      
    downloadExcelFile(datas, 'new.csv');
    
})

// // '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
// $(window).on("load resize ", function() {
//     var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
//     $('.tbl-header').css({'padding-right':scrollWidth});
//   }).resize();