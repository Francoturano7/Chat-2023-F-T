console.log("Java script desde el frontend")

const socketClient= io()

const userName=document.getElementById("userName")
const inputMsg=document.getElementById("inputMsg")
const sendMsg=document.getElementById("sendMsg")
const chatPanel=document.getElementById("chatPanel")


let user

Swal.fire({
    html:`<h1 class="titulos">~ Chat-App ~</h1>
    <p class="login">>>LOGIN<<</p>`,
    imageUrl: '/img/phone.png',
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: 'Cyan Telephone image',
    input:`text`,
    inputPlaceholder: 'Ingrese su nombre de usuario',
    confirmButtonColor: '#008b8b',
    padding: '3em',
  color: '#008b8b',
  backdrop: `#008b8b`,
    inputValidator:(value)=>{
        return !value && "Debes ingresar el nombre de usuario para continuar"
    },
    allowOutsideClick:false,
    allowEscapeKey:false
}).then((inputValue)=>{
    console.log(inputValue)
    user=inputValue.value
    userName.innerHTML=user
    socketClient.emit("authenticated",user)
})

sendMsg.addEventListener("click",()=>{
    let hora=new Date()
    const msg ={hours:hora.toLocaleTimeString() ,user:user, message:inputMsg.value}
    if(inputMsg.value===""){
        console.log("Mensaje vacio")
    }else{
        socketClient.emit("msgChat",msg)
        inputMsg.value=""
    }
})

socketClient.on("chatHistory",(dataServer)=>{
    console.log(dataServer)
    let msgElements=""
    dataServer.forEach(elm=>{
        msgElements+= `<p class="chat"><span class="hora">${elm.hours}</span> <span class="nombre"> -${elm.user}</span> :<span class="contenido"> ${elm.message}</span></p>
        `
    })
    chatPanel.innerHTML=msgElements
})

socketClient.on("newUser",(data)=>{
    if(user){
        Swal.fire({
            text:data,
            toast:true,
            position:"center",
            confirmButtonColor: '#008b8b',
        })
    }
})
