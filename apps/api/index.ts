import express from "express"

const app = express();
const PORT = 3000;


app.post("/api/v1/website", (req,res)=>{

})

app.get("/api/v1/website/status", (req,res)=>{
    
})

app.get("/api/v1/websites", (req,res)=>{
    
})

app.delete("/api/v1/website/", (req,res)=>{
    
})




app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`)
})