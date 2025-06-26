// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client, Message, middleware, TextMessage, WebhookEvent } from '@line/bot-sdk';
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
app.use(express.json()); // สำหรับ Parse JSON Body

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



app.post('/hook', middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;
    try {
        const results = await Promise.all(
            events.map(async (event: WebhookEvent) => {
                try {
                    await handleEvent(event);
                } catch (err: any) {
                    console.error(`Error processing event: ${err.message}`, event);
                    // ไม่จำเป็นต้อง re-throw เพื่อให้ process เหตุการณ์อื่นต่อไป
                }
            })
        );
        res.json(results); // ส่ง response กลับไปให้ LINE
    } catch (err: any) {
        console.error('Error in webhook handler:', err);
        res.status(500).end();
    }

});

async function handleEvent(event: WebhookEvent): Promise<any> {
    // ตรวจสอบประเภทของเหตุการณ์ว่าเป็นข้อความและเป็นข้อความตัวอักษรหรือไม่
    if (event.type === 'message' && event.message.type === 'text') {
        const { replyToken } = event;
        const { text } = event.message ?? {};
        x.push({ ind: x.length, event })

        console.log(`Received message: "${text}" from user: ${event.source.userId}`);

        // สร้างข้อความตอบกลับ (ตัวอย่าง: Echo Bot)
        const echoMessage: TextMessage = {
            type: 'text',
            text: `You said: "${text}"`
        }

        // ตอบกลับข้อความ
        await client.replyMessage(replyToken, echoMessage);
        console.log(`Replied with: "${echoMessage.text}"`);
    } else {
        // สำหรับเหตุการณ์อื่นๆ หรือข้อความประเภทอื่นๆ (รูปภาพ, สติ๊กเกอร์ ฯลฯ)
        // คุณสามารถเพิ่ม logic การจัดการในอนาคตได้
        console.log(`Unhandled event type: ${event.type}`, event);
    }
}

app.get('/get-hook', (req, res) => {
    res.json({ hook: x });
});


// สำคัญ: ต้อง export app ออกมาสำหรับ Vercel Serverless Function
export default app; 