const express = require('express')
const { createServer } = require('node:http')
const { join } = require('node:path');
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static("public"))

app.get('/', (req, res) =>{
  res.sendFile(join(__dirname, 'public/index.html'));
})

const playersBackEnd = {}
const projeteisBackEnd = []

io.on('connection', (socket) =>{
  console.log('cliente se conectou: '+ socket.id)
  const rand = 100*Math.random()
  playersBackEnd[socket.id] = {
    x: 500+rand,
    y: 500+rand,
    canhao:{
      angulo: 0,
    },
    cor: `hsl(${360*Math.random()},100%,50%)`,
    tempoTiro: 0,
  }

  io.emit('updatePlayers', playersBackEnd)

  socket.on('disconnect', ()=>{
    console.log('desconectou: '+ socket.id)
    delete playersBackEnd[socket.id]

    io.emit('updatePlayers', playersBackEnd)

  })

  socket.on('mover', (velocidadeX, velocidadeY, mira) => {
    playersBackEnd[socket.id].x += velocidadeX
    playersBackEnd[socket.id].y += velocidadeY
    
    const angulo = Math.atan2(mira.y - playersBackEnd[socket.id].y, mira.x - playersBackEnd[socket.id].x)
    
    playersBackEnd[socket.id].canhao.angulo = angulo


    io.emit('updatePlayers', playersBackEnd)
    
  })

  socket.on('atirar', ()=>{
    projeteisBackEnd.push({
      x: playersBackEnd[socket.id].x,
      y: playersBackEnd[socket.id].y,
      angulo: playersBackEnd[socket.id].canhao.angulo,
      cor: playersBackEnd[socket.id].cor, 
    })

    io.emit('updateProjeteis', projeteisBackEnd)
  })

  setInterval(() => {
    projeteisBackEnd.forEach((projetil, i)=>{
      projetil.x += 5*Math.cos(projetil.angulo)
      projetil.y += 5*Math.sin(projetil.angulo)
  
    })
    io.emit('updateProjeteis', projeteisBackEnd)

  }, 20);
    
})

server.listen(3000, () =>{
    console.log('server rodando na porta 3000')
})

