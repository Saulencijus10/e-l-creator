const path = require('path');
const fs = require('fs');
const http = require('http');
const { URL } = require('url');
//const express = require('express');

class App {
    constructor(encodingFilePath) {
        this.encodingFilePath = encodingFilePath;
        //this.resolvedPath = null;  // Default value to prevent undefined errors
        this.initiate();
    }

    initiate() {
        if (typeof this.encodingFilePath == 'string') {
            const resolvedPath = path.resolve(this.encodingFilePath);
            try {
                const stats = fs.statSync(resolvedPath);
                const ext = path.extname(resolvedPath);
                if (ext == '.json') {
                    this.resolvedPath = resolvedPath;
                    return resolvedPath;
                } else {
                    console.log('Error, file must be .json')
                }
            } catch (error) {
                console.log('Error: Path error: ', error);
                console.log(`${resolvedPath} is a valid file.`);
            }

        } else if (typeof this.encodingFilePath == 'boolean') {

        } else {
            console.log('Error, file path is wrong');
        }
    }

    encode(what_to_encode, level) {
        let data = fs.readFileSync(this.resolvedPath, 'utf8');
        if (!data.trim()) {
            fs.writeFileSync(this.resolvedPath, '{}');
        }
        data = fs.readFileSync(this.resolvedPath, 'utf8');
        let jsonData = JSON.parse(data);
        if (!jsonData.symbols) {
            jsonData.symbols = {};
        }
        if (!jsonData.options) {
            jsonData.options = {};
        }
        fs.writeFileSync(this.resolvedPath, JSON.stringify(jsonData, null, 2));
        if ((typeof level == 'number') && (!jsonData.options.DefaulLevel)) {
            console.log('ATTENTION: AFTER THE LEVEL WAS SET WHEN BOOTING THE LANGUAGE FOR THE FIRST TIME, IF YOU CHANGE THE VALUE THE DECODING WILL STOP WORKING AS EXPECTED, SO WHEN SHARING A DECODING LANGUAGE IN PARAMETERES OF THE ENCODE FUNCTION PLEASE USE null.');
            if (!jsonData.options.defaultLevel) {
                jsonData.options.DefaulLevel = level;
            }
            fs.writeFileSync(this.resolvedPath, JSON.stringify(jsonData, null, 2));
        } else if ((!(typeof level == 'number'))) {
            console.log('Level was undefined(this is only required for the first time) ATTENTION: AFTER THE LEVEL WAS SET WHEN BOOTING THE LANGUAGE FOR THE FIRST TIME, IF YOU CHANGE THE VALUE THE DECODING WILL STOP WORKING AS EXPECTED, SO WHEN SHARING A DECODING LANGUAGE IN PARAMETERES OF THE ENCODE FUNCTION PLEASE USE null.')
            return;
        }
        let encoded = "";
        if ((typeof what_to_encode == 'string') && ((level == null) || (typeof level == 'number'))) {
            for (let i = 0; i < what_to_encode.length; i++) {
                data = fs.readFileSync(this.resolvedPath, 'utf8');
                jsonData = JSON.parse(data);
                const symbol = what_to_encode[i];
                if (!jsonData.symbols[symbol]) {
                    let length = "";
                    let result = '';
                    let isUnique = false;
                    for (let i = 0; i < jsonData.options.DefaulLevel; i++) {
                        length = length += jsonData.options.DefaulLevel;
                    }
                    length = parseInt(length);
                    if (length === Object.keys(jsonData.symbols).length) {
                        isUnique = true;
                        console.log("Your default Level is too low, please reset your Encoding language.")
                    }
                    while (!isUnique) {
                        for (let i = 0; i < jsonData.options.DefaulLevel; i++) {
                            result += Math.floor(Math.random() * 10);
                        }
                        if (!Object.values(jsonData.symbols).includes(result)) {
                            isUnique = true;
                        }
                    }
                    jsonData.symbols[symbol] = result;
                    fs.writeFileSync(this.resolvedPath, JSON.stringify(jsonData, null, 2));
                }
                let curLevel;
                if (level >= jsonData.options.DefaulLevel) {
                    curLevel = jsonData.options.DefaulLevel;
                } else if (0 > level < jsonData.options.DefaulLevel) {
                    curLevel = level;
                } else {
                    console.log('Level is wrong, seti it to either number or null')
                }
                let str = jsonData.symbols[symbol];
                if (jsonData.symbols[symbol].length === 9) {
                    const trimmedStr = str.substring(0, curLevel);
                    encoded += trimmedStr;
                } else {
                    encoded += 'Error';
                    console.log("Error: the default level is wrong, reset the encoding language.");
                }
            }
        }
        let curLevel;
        if (level >= jsonData.options.DefaulLevel) {
            curLevel = jsonData.options.DefaulLevel;
        } else if (0 > level < jsonData.options.DefaulLevel) {
            curLevel = level;
        } else {
            console.log('Level is wrong, set it to either number or null')
        }
        encoded += ":";
        encoded += curLevel;
        return encoded;
    }
    decode(what_to_decode) {
        const data = JSON.parse(fs.readFileSync(this.resolvedPath, 'utf8'));
        let index = what_to_decode.split(':')[1];
        let codeOr = what_to_decode.split(':')[0];
        let result = [];
        // Tikslus padalijimas į dalis
        const parts = Math.ceil(codeOr.length / index); // Apskaičiuojame dalis
        for (let i = 0; i < parts; i++) {
            result.push(codeOr.slice(i * index, (i + 1) * index));
        }
        /*for (let i = 0; i < codeOr.length; i += index) {
            result.push(codeOr.slice(i, i + index));
        }*/
        let decode = "";
        for (let i = 0; i < result.length; i++) {
            let chunk = result[i];
            let symbol = Object.keys(data.symbols).find(key => data.symbols[key].startsWith(chunk));
            decode += symbol;
        }
        return decode;
    }
    initiate_web(port) {
        let data = fs.readFileSync(this.resolvedPath, 'utf8');
        let jsonData = JSON.parse(data);
        const server = http.createServer((req, res) => {
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const path2 = urlObj.pathname;
            if (path2 === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Site</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: rgb(0, 0, 0);
            background: linear-gradient(0deg, rgba(0, 0, 0, 1) 70%, rgba(71, 71, 71, 1) 100%);
            margin: 0;
            font-family: Arial, sans-serif;
        }

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 90%;
            max-width: 600px;
            padding: 40px 20px 20px;
            /* Extra padding at the top for the button */
            border-radius: 10px;
            background-color: rgb(71, 71, 71);
        }

        .options-button {
            font-size: 150%;
            position: absolute;
            top: 10px;
            right: 10px;
            color: white;
            cursor: pointer;
            z-index: 10;
        }

        textarea {
            width: 100%;
            height: 300px;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            resize: none;
            background-color: rgb(114, 114, 114);
            margin-top: 2px;
            /* Pushes textarea down to avoid overlap */
            color: white;
        }

        ::placeholder {
            color: white;
        }

        .buttons-container {
            display: flex;
            gap: 10px;
            width: 100%;
            /* Ensure it matches the textarea width */
            margin-top: 10px;
            /* Adds space between textarea and buttons */
        }

        .button {
            flex: 1;
            /* Ensures buttons take equal space */
            padding: 10px;
            border: none;
            border-radius: 8px;
            background-color: rgb(114, 114, 114);
            color: white;
            font-size: 16px;
            cursor: pointer;
            text-align: center;
        }

        /* Stack buttons on smaller screens */
        @media (max-width: 600px) {
            .buttons-container {
                flex-direction: column;
            }
        }

        #popup {
            width: 300px;
            height: 400px;
            background-color: rgb(114, 114, 114);
            color: white;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 10px;
            text-align: center;
        }

        #closeBtn {
            cursor: pointer;
            margin-top: 10px;
            background-color: rgb(148, 146, 146);
            color: white;
            border: none;
            padding: 5px;
            border-radius: 5px;
        }
        input[type=range] {
            -webkit-appearance: none;
            margin: 20px 0;
            width: 100%;
        }
        input[type=range]:focus {
            outline: none;
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            animate: 0.2s;
            background: #03a9f4;
            border-radius: 25px;
        }
        input[type=range]::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 0 4px 0 rgba(0,0,0, 1);
            cursor: pointer;
            -webkit-appearance: none;
            margin-top: -8px;
        }
        input[type=range]:focus::-webkit-slider-runnable-track {
            background: #03a9f4;
        }
        .range-wrap{
            width: 90%;
            margin: 2rem;
            position: relative;
        }
        .range-value{
            position: absolute;
            top: -50%;
        }
        .range-value span{
            width: 30px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: #03a9f4;
            color: #fff;
            font-size: 12px;
            display: block;
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            border-radius: 6px;
        }
        .range-value span:before{
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border-top: 10px solid #03a9f4;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            top: 100%;
            left: 50%;
            margin-left: 5%;
            margin-top: -1px;
        }
        .file {
            font-size: 100%;
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            cursor: pointer;
            z-index: 10;
        }
    </style>
</head>

<body>
    <div class="container">
        <input type="file" id="fileInput" class="file">
        <span class="options-button" onclick="showPopup()">&#8942;</span>
        <div id="popup">
            <p>Settings</p>
            <div class="range-wrap">
                <div class="range-value" id="rangeV"></div>
                <input id="range" type="range" min="1" max="` + jsonData.options.DefaulLevel + `" value="9" step="1">
            </div>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
        <textarea id="textInput" placeholder="Start typing..."></textarea>
        <div class="buttons-container">
            <button onclick="encodeText()" class="button">Encode</button>
            <button onclick="decodeText()" class="button">Decode</button>
        </div>
    </div>
    <script>
        function showPopup() {
            document.getElementById('popup').style.display = 'block';
        }
        function closePopup() {
            document.getElementById('popup').style.display = 'none';
        }
        async function encodeText() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            if (!file) {
                const text = document.getElementById("textInput").value;
                const level = document.getElementById("range").value;
                const response = await fetch(` + "`/api/encode?what_to_encode=${encodeURIComponent(text)}&level=${level}`" + `);
                const data = await response.json();
                document.getElementById("textInput").value = data.encoded;
            } else {
                const level = document.getElementById("range").value;
                const formData = new FormData();
                formData.append("file", file);
                try {
                    const response = await fetch(` + "`/api/encodefiles?level=${level}`" + `, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type || "application/octet-stream", // Preserve file type
                            "X-File-Name": encodeURIComponent(file.name) // Send filename in header
                        },
                        body: file // Send raw binary data
                    });

                    //const result = await response.json();

                    if (!response.ok) throw new Error("Failed to encode file");
                    const contentDisposition = response.headers.get('X-File-Name');
                    const FileName2 = contentDisposition ? decodeURIComponent(contentDisposition) : "decoded.txt";

                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = downloadUrl;
                    a.download = FileName2; // Ensure it downloads as .txt
                    document.body.appendChild(a);
                    a.click(); // Trigger download
                    document.body.removeChild(a); // Cleanup
                    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            }
        }

        async function decodeText() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            if (!file) {
                const text = document.getElementById("textInput").value;
                const response = await fetch(` + "`/api/decode?what_to_decode=${encodeURIComponent(text)}`" + `);
                const data = await response.json();
                document.getElementById("textInput").value = data.decoded;
            } else {
                try {
                    const response = await fetch(` + '`/api/decodefiles`' + `, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "text/plain", // Sending encoded number string
                            "X-File-Name": encodeURIComponent(file.name) // Preserve original file name
                        },
                        body: file
                    });

                    if (!response.ok) throw new Error("Failed to decode file");
                    const contentDisposition = response.headers.get('X-File-Name');
                    const FileName2 = contentDisposition ? decodeURIComponent(contentDisposition) : "decoded.txt";

                    // Get decoded file as Blob
                    const blob = await response.blob();
                    const fileExtension = file.name.split('.').pop(); // Extract original extension
                    const downloadUrl = URL.createObjectURL(blob);

                    // Create a hidden download link
                    const a = document.createElement("a");
                    a.href = downloadUrl;
                    a.download = ` + "`${FileName2}`" + `; // Use original extension
                    document.body.appendChild(a);
                    a.click(); // Trigger the download
                    document.body.removeChild(a); // Cleanup

                    // Release the object URL
                    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
                } catch (error) {
                    console.error("Error decoding file:", error);
                }
            }
        }
        const range = document.getElementById('range'),
            rangeV = document.getElementById('rangeV'),
        setValue = ()=>{
            const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
                newPosition = 10 - (newValue * 0.2);
            rangeV.innerHTML = ` + "`<span>${range.value}</span>`" + `;
            rangeV.style.left = ` + "`calc(${newValue}% + (${newPosition}px))`" + `;
        };
        document.addEventListener("DOMContentLoaded", setValue);
        range.addEventListener('input', setValue);
    </script>
</body>
</html>
`);
            } else if (path2 === '/api/encode' && req.method === 'GET') {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const what_to_encode = url.searchParams.get('what_to_encode');
                let level = url.searchParams.get('level');
                if (!what_to_encode || !level) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Missing query parameters" }));
                }
                level = parseInt(level, 10)
                const result = this.encode(what_to_encode, level);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ encoded: result }));
            } else if (path2 === '/api/encodefiles' && req.method === 'PUT') {
                //console.log("Received PUT request at /api/encodefiles");
                const url = new URL(req.url, `http://${req.headers.host}`);
                let level = url.searchParams.get('level');
                if (!level) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Missing level parameters" }));
                }

                level = parseInt(level, 10);
                const fileName = decodeURIComponent(req.headers['x-file-name'] || 'uploaded_file.txt');

                let fileBuffer = Buffer.alloc(0);

                req.on('data', chunk => {
                    console.log("Receiving data chunk:", chunk.length);
                    fileBuffer = Buffer.concat([fileBuffer, chunk]);
                });

                req.on('end', () => {
                    console.log(fileName);
                    //console.log("Finished receiving data. Total size:", fileBuffer.length);
                    const fileExtension = path.extname(fileName).toLowerCase();
                    let numberString = fileName + ':';
                    for (let i = 0; i < fileBuffer.length; i++) {
                        numberString += fileBuffer[i] + ',';
                    }
                    const encoded = this.encode(numberString, level);
                    //console.log("Encoded file as numbers:", numberString.substring(0, 100) + "..."); // Show first 100 characters
                    //res.json({ encoded: encoded });
                    const FileName2 = `${fileName}.txt`;
                    const encodedBuffer = Buffer.from(encoded, 'utf-8');
                    res.writeHead(200, {
                        'Content-Disposition': `attachment; filename="${fileName}.txt"`,
                        'Content-Type': 'text/plain',
                        'X-File-Name': `${FileName2}`
                    });
                    res.end(encodedBuffer);
                });

                req.on('error', (err) => {
                    console.error("File processing error:", err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error processing file" }));
                });
            } else if (path2 === '/api/decodefiles' && req.method === 'PUT') {
                //console.log("Received PUT request at /api/decodefiles");

                const fileName = decodeURIComponent(req.headers['x-file-name'] || 'decoded_file');

                // Ensure the file is a .txt file (by extension or content type)
                if (!fileName.endsWith('.txt')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Only .txt files are allowed" }));
                }

                let fileBuffer = Buffer.alloc(0);

                req.on('data', chunk => {
                    fileBuffer = Buffer.concat([fileBuffer, chunk]);
                });

                req.on('end', () => {
                    console.log("Finished receiving file. Total size:", fileBuffer.length);

                    // Convert buffer back to a string (assuming the file is text-based)
                    const encodedString = fileBuffer.toString('utf-8');

                    // Perform decoding using your app.decode function
                    const decodedResult = this.decode(encodedString, this.resolvedPath);
                    const byteArray = decodedResult.split(":")[1].split(',').map(num => parseInt(num, 10)).filter(n => !isNaN(n));
                    //console.log("Decoded data preview:", decodedResult.substring(0, 100) + "...");
                    const decodedFileName = `${decodedResult.split(':')[0]}`;
                    // Convert decoded result to Buffer (to be returned as text file)
                    const decodedBuffer = Buffer.from(byteArray, 'utf-8');
                    res.writeHead(200, {
                        'Content-Disposition': `attachment; filename="${decodedFileName}"`,
                        'X-File-Name': decodedFileName,
                        'Content-Type': 'application/octet-stream'
                    });

                    // Send the decoded content as response
                    res.end(decodedBuffer);
                });

                req.on('error', (err) => {
                    console.error("Error during file processing:", err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error processing file" }));
                });
            } else if (path2 === '/api/decode' && req.method === 'GET') {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const what_to_decode = url.searchParams.get('what_to_decode');

                if (!what_to_decode) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Missing query parameters" }));
                }
                const result = this.decode(what_to_decode, this.resolvedPath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ decoded: result }));
            };
        });
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
};
module.exports = App;