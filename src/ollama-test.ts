// ファイル名: ollama-test.ts

import axios from 'axios';

async function testOllamaConnection(baseUrl: string, model: string) {
    const url = `${baseUrl}/api/generate`;
    const data = {
        model: model,
        prompt: "Hello, are you working?",
        stream: false
    };

    try {
        console.log(`Sending request to ${url}`);
        const response = await axios.post(url, data);
        console.log('Response received:', response.data);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// 設定したbaseUrlとmodelを使用してテスト
testOllamaConnection('http://localhost:11434', 'codeglass');