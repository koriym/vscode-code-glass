import axios from 'axios';

async function testDeepSeekConnection() {
    const url = `https://api.deepseek.com/chat/completions`;
    const data = {
        "messages": [
            {
              "content": "Hi",
              "role": "user"
            }
        ],
        "model": "deepseek-coder",
        "stream": true
    };

    const apiKey = process.env.CODEGLASS_API_KEY;
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log(`Sending request to ${url}`);
        const response = await axios.post(url, data, {headers: headers});
        console.log('Response received:', response.data);
        console.log('Status:', response.status);
        console.log('Message:', response.data.choices[0].message);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

testDeepSeekConnection();
