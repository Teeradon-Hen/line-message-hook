// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

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

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // สำหรับ Parse JSON Body

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Vercel Express API with TypeScript!' });
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ id: userId, name: `User ${userId}`, type: 'TypeScript' });
})
const x: any[] = []



app.get('/hook', (req, res) => {
    x.push({ ind: x.length, body: req.body })
    res.json({ message: 'Hook received' });
});

app.get('/get-hook', (req, res) => {
    res.json({ hook: x });
});


// สำคัญ: ต้อง export app ออกมาสำหรับ Vercel Serverless Function
export default app;