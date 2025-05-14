import express from "express"
import { client } from "db/client";
import { authMiddleware } from "./middleware";
import cors from "cors"

const app = express();
const PORT = 8080;

app.use(cors())
app.use(express.json())

app.post("/api/v1/website", authMiddleware, async (req ,res)=>{
    const userId = req.userId!;
    const { url } = req.body;
    const data = await client.website.create({ data: { userId, url } });
    res.json({ id: data.id });
})

app.get("/api/v1/website/status", authMiddleware, async (req,res)=>{
    const websiteId= req.query.websiteId! as unknown as string;
    const userId = req.userId;
    const data = await client.website.findFirst({ where: { id: websiteId, userId } });
    res.json(data);
})

app.get("/api/v1/websites", authMiddleware, async (req,res)=>{
    const userId = req.userId;
    const data = await client.website.findMany({
        where: { userId, disabled: false },
        include: { ticks: true }
    });
    res.json({ websites: data });
})

app.delete("/api/v1/website/", authMiddleware, async (req,res)=>{
    const websiteId = req.body.websiteId;
    const userId = req.userId;
    await client.website.update({
        where: { id: websiteId, userId },
        data: { disabled: true }
    });
    res.json({ message: "Deleted website successfully" });
})

app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`);
})