import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import proxyRouter from "./routes/proxy.js"
import collectionsRouter from "./routes/collections.js"
import collectionItemsRouter from "./routes/collectionItems.js"
import historyRouter from "./routes/history.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/proxy", proxyRouter)
app.use("/collections", collectionsRouter)
app.use("/collections", collectionItemsRouter)
app.use("/history", historyRouter)

app.get("/", (req, res) => {
    res.send("Proxy Server Running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
console.log("Connected to Supabase:", process.env.SUPABASE_URL);