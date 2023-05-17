
import * as Api from '/api.js';

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

// // '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
// $(window).on("load resize ", function() {
//     var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
//     $('.tbl-header').css({'padding-right':scrollWidth});
//   }).resize();