require('dotenv').config();
const express = require("express")
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const listOfGames = require('./games/listOfGames');
let listOfMessages=require('./games/messages');
let gameIndex=0;

app.use(cors());
app.use(express.json());

app.get('/gameslist',(req,res)=>{
    const games = listOfGames.filter(game=>!game.active);
    res.send(games)
})

app.get('/message',(req,res)=>{
    const name = req.query.name;
    const id = parseInt(req.query.id);
    const messages = listOfMessages.filter(message=>message.name!==name && message.id==id);
    listOfMessages = listOfMessages.filter(message=>(message.name===name && message.id==id) || message.id!=id);
    res.status(200).send(messages)
})

app.get('/allmessages',(req,res)=>{
    res.status(200).send(listOfMessages)
})

app.post('/creategame',(req,res)=>{
    if(!req.body.name){
        res.status(404)
    }
    else{
        listOfGames.push({
            name:req.body.name,
            active:false,
            id:gameIndex
        });
        res.status(201).send({message:"Game created. Waiting for an opposition player.",id:gameIndex++});
    }
})

app.put('/joingame',(req,res)=>{
    const id = parseInt(req.body.id);
    const game = listOfGames.find(game=>game.id==id);
    game.active=true;
    listOfMessages.push({
        name:"oppo",
        id:id,
        message:"You have an opponent."
    });        
    res.status(200).send({});

})

app.post('/postmessage',(req,res)=>{
    listOfMessages.push(req.body);
    res.status(200).send({});
})

app.listen(PORT,()=>console.log(`Server is now listening on port: ${PORT}`))