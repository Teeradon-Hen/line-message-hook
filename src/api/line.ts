import express from 'express';
import { middleware, Client, WebhookEvent, TextMessage } from '@line/bot-sdk';

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET || '',
};

const client = new Client(config);
const rounter = express.Router()

// ห้ามใช้ express.json() ก่อน LINE middleware
rounter.post('/api/line-test', middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;
    await Promise.all(events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
            const echoMessage: TextMessage = {
                type: 'text',
                text: `You said: "${event.message.text}"`
            };
            await client.replyMessage(event.replyToken, echoMessage);
        }
    }));
    res.status(200).json({});
});

rounter.post('/api/line', middleware(config), async (req, res) => {
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
        // res.json(results); // ส่ง response กลับไปให้ LINE
        res.status(200).json({});
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

export default rounter; 