// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client, Message, middleware, TextMessage, WebhookEvent } from '@line/bot-sdk';
import 'dotenv/config';

// ติดตั้ง @vercel/node เพื่อใช้ Type เหล่านี้: npm install @vercel/node
// export default function (request: VercelRequest, response: VercelResponse) {
//   response.status(200).json({
//     message: 'Hello from Node.js TypeScript API on Vercel!',
//     method: request.method,
//     timestamp: new Date().toISOString()
//   });
// }

// src/api/index.ts
import express from 'express';
import line from './line.ts';
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET || '',
};

if (!config.channelAccessToken || !config.channelSecret) {
    console.error("LINE Channel Access Token and Channel Secret are required!");
    // ใน Production ควรจะ throw error หรือจัดการการ shutdown
    // แต่สำหรับ Vercel Serverless Function มันจะรันเมื่อถูกเรียกเท่านั้น
}

// สร้าง LINE Client
const client = new Client(config);


const app = express();
const PORT = process.env.PORT || 3000;
// app.use(express.json()); // สำหรับ Parse JSON Body
app.use(line)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Vercel Express API with TypeScript!', config });
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ id: userId, name: `User ${userId}`, type: 'TypeScript' });
})
const x: any[] = []



app.get('/get-hook', (req, res) => {
    res.json({ hook: x });
});


// สำคัญ: ต้อง export app ออกมาสำหรับ Vercel Serverless Function
export default app; 