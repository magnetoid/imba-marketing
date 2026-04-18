const fs = require('fs');
const composeRaw = fs.readFileSync('temp_compose3.yaml', 'utf8');
const payload = JSON.stringify({ docker_compose_raw: composeRaw });

fetch('https://coo.imbamarketing.com/api/v1/applications/u46q4bzn4vrp4r62cplm4x0c', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Bearer 10|iPg58tSkReSzK3jQfiLONfaUo4FlYxVUze0jUljK9c012830',
        'Content-Type': 'application/json'
    },
    body: payload
})
.then(res => res.text())
.then(text => console.log('PATCH response:', text))
.catch(err => console.error(err));
