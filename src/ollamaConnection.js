"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaConnection = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaConnection {
    baseUrl;
    model;
    apiKey;
    constructor(baseUrl, model, apiKey) {
        this.baseUrl = baseUrl;
        this.model = model;
        this.apiKey = apiKey;
    }
    async generateCommentStream(code, prompt, onChunk, onProgress, token) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: true
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                responseType: 'stream'
            });
            return new Promise((resolve, reject) => {
                response.data.on('data', (chunk) => {
                    const chunkStr = chunk.toString();
                    onChunk(chunkStr);
                    onProgress(chunkStr.length);
                });
                response.data.on('end', () => {
                    resolve();
                });
                response.data.on('error', (error) => {
                    reject(error);
                });
            });
        }
        catch (error) {
            console.error('Error in generateCommentStream:', error);
            throw error;
        }
    }
}
exports.OllamaConnection = OllamaConnection;
//# sourceMappingURL=ollamaConnection.js.map