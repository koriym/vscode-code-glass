"use strict";
// ファイル名: ollama-test.ts
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
async function testOllamaConnection(baseUrl, model) {
    const url = `${baseUrl}/api/generate`;
    const data = {
        model: model,
        prompt: "Hello, are you working?",
        stream: false
    };
    try {
        console.log(`Sending request to ${url}`);
        const response = await axios_1.default.post(url, data);
        console.log('Response received:', response.data);
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
}
// 設定したbaseUrlとmodelを使用してテスト
testOllamaConnection('http://localhost:11434', 'codeglass');
//# sourceMappingURL=ollama-test.js.map