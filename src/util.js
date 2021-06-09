import axios from 'axios';

export async function postTarget(target_url) {

    let httpStatusCd = null;

await axios.post(target_url, null,{
    headers: {
        "Content-Type": 'application/json'
    }
}).then(function(res) {
    console.log(res);
    httpStatusCd = res.status
})
    return httpStatusCd;
}