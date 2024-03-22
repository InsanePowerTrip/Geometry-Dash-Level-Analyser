const https = require('https');
const fs = require('fs');
const zlib = require('zlib');

const lvlID = "128"; // ! Replace this with the actual ID

const data = {
    secret: "Wmfd2893gb7",
    levelID: lvlID
};

const postData = new URLSearchParams(data).toString();

const options = {
    hostname: 'www.boomlings.com',
    port: 443,
    path: '/database/downloadGJLevel22.php',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': ''
    }
};

const req = https.request(options, (res) => {
    let response = '';

    res.on('data', (chunk) => {
        response += chunk;
    });

    res.on('end', () => {
        if (response === "-1") {
            console.log("Something went wrong");
        } else {
            const base64Data = response.split(":")[7];
            const decodedData = Buffer.from(base64Data, 'base64');
            fs.writeFileSync("application.gz", decodedData);

            const code = zlib.gunzipSync(decodedData).toString();
            fs.unlinkSync("application.gz");

            console.log(code);
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(postData);
req.end();
