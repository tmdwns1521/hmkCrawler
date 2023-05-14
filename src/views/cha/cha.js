
import * as Api from '/api.js';

window.onload = async function () {
    let params = window.location.href;
    params = params.split("/");
    const status = params[params.length - 2];
    const query = {
        status: status,
    }
    let postData = await Api.post('http://localhost:80/api/getPlace', query);
    console.log(postData)
    postData = await postData.reduce((prev, next) => {
        let key = next['id']
        if (!prev[key]) {
            prev[key] = {}
            prev[key]['kakaotalk_name'] = next['kakaotalk_name']
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
    console.log(postData);

    const plcaeList = document.getElementById('place_list')
    let dateList;
    for (const pd in postData) {
        let rankDiv = '';
        dateList = '';
        postData[pd]['rank_data'].forEach((e) => {
            rankDiv += `<td style="color: ${e.rate}">${e.rank}</td>`
            dateList += `<th>${e.created_at.split(" ")[0]}</th>`
        });
        const data = `<tr>
            <td>${postData[pd]['kakaotalk_name']}</td>
            <td>${postData[pd]['guaranteed_rank']}</td>
            <td>${postData[pd]['business_number']}</td>
            <td>${postData[pd]['keyword']}</td>
            <td>${postData[pd]['company_name']}</td>
            <td>${postData[pd]['company_number']}</td>
            <td>${postData[pd]['company_phone']}</td>
            <td><a href=https://map.naver.com/v5/search/%EB%84%A4%EC%9D%B4%EB%B2%84%EC%A7%80%EB%8F%84/place/${postData[pd]['company_code']} target="_blank">${postData[pd]['company_code']}</a></td>
            ${rankDiv}
        </tr>`
        plcaeList.innerHTML += data;
      }
    const placeListTr = document.getElementById('place_list_tr')
    placeListTr.innerHTML += dateList
}

// // '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
// $(window).on("load resize ", function() {
//     var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
//     $('.tbl-header').css({'padding-right':scrollWidth});
//   }).resize();