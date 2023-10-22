import express from "express"
import {__dirname} from "./utils.js"
import path from "path"
import {engine} from "express-handlebars"
import{Server} from "socket.io"


import { viewsRouter } from "./routes/views.routes.js"

const port= process.env.PORT || 8080
const app=express()

//midlewares
app.use(express.json())
app.use(express.static(path.join(__dirname,"/public")))

//servidor de http con express
const httpServer= app.listen(port,()=>console.log(`Servidor escuchando en el puerto ${port}`))

//servidor de websocket
const io=new Server(httpServer)

//configuracion handlebars
app.engine(".hbs",engine({extname:".hbs"}))
app.set(`view engine`,`.hbs`)
app.set(`views`,path.join(__dirname,"/views"))

//routes
app.use(viewsRouter)

let chat=[]

//socket servidor
io.on("connection",(socket)=>{
    //cuando se conecta el usuario enviamos historial de chat
    socket.emit("chatHistory",chat)

    //recibimos el msg de cada usuario
    socket.on("msgChat",(data)=>{
        chat.push(data)

        //enviamos el historial del chat a todos los user conect
        io.emit("chatHistory",chat)
    })

    //recibimos msg de coneccion de new client
    socket.on("authenticated",(data)=>{
        socket.broadcast.emit("newUser", `${data} se acaba de unir al chat`)
    })
})

