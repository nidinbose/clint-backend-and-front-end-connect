const http=require("http")
const fs=require("fs")
const url=require("url")
const queryString=require("querystring")
const {MongoClient}=require("mongodb") 
const client=new MongoClient("mongodb://localhost:27017/")

const app=http.createServer((req,res)=>{

    const db=client.db("asdf")
    const collection=db.collection("doners");
    let urlpath=url.parse(req.url)
    console.log(urlpath);
    console.log(req.method);
    if(urlpath.pathname=="/"){
        res.writeHead(200,{"Content-Type":"text/html"})
        res.end(fs.readFileSync("../client/index.html"))
    }
    else if(urlpath.pathname=="/style.css"){
        res.writeHead(200,{"Content-Type":"text/css"})
        res.end(fs.readFileSync("../client/style.css"))

    }
    else if(urlpath.pathname=="/submit"&&req.method=="POST"){
        let body=``;
        req.on("data",(chunks)=>{
            body+=chunks.toString();
            console.log(body);
        })
              req.on("end",async()=>{
            console.log(body);
            const formData=queryString.parse(body)
            console.log(formData);
            collection.insertOne(formData)
            .then(()=>{
                console.log("successfully added");
            })
            .catch((error)=>{
                console.log(error);
            })
        })
        res.writeHead(200,{"Content-Type":"text/html"})
        res.end(fs.readFileSync("../client/index.html"))
    }
})
client.connect().then(()=>{
   
    app.listen(3000,()=>{
        console.log("server started");
    })
}).catch((error)=>{
    console.log(error);
})

