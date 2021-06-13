import axios from 'axios';

export async function postTarget(target_url) {
// 対向に対してpostリクエストを実行する
    let httpStatusCd = null;

await axios.post(target_url, null,{
    headers: {
        "Content-Type": 'application/json'
    }
}).then(function(res) {
    console.log('axios response', res);
    httpStatusCd = res.status

}).catch(function(error) {
    console.log('axios response', error);
    httpStatusCd = error.response.status
})
    return httpStatusCd;
}