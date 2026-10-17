const socket = io()

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let gameOver = false
let frameAtual = 0
let pause = false
let pontos = 0
let tempoSpawnInimigos = 250

const shot = new Audio('./assets/sounds/pew-shot.wav')

const players = {}
const projeteis = []

const playerLocal={
    posicao:{
        x: 0,
        y: 0,
    },
    canhao:{
        angulo: 0,
    },
    angulo: 0,
    mira:{
        x: 0,
        y: 0,
    },
    keys:{
        w: 0,
        s: 0,
        a: 0,
        d: 0,
    },
    tempoTiro: 0
}

socket.on('updatePlayers', (playersBackEnd) =>{
    for(const i in playersBackEnd){
        const playerBackEnd = playersBackEnd[i]
        
        if(!players[i]){
            players[i] = new Player({
                posicao: {
                    x: playerBackEnd.x,
                    y: playerBackEnd.y
                }, 
                velocidade: 5,
                raio: 20,
                cor: playerBackEnd.cor,
                canhao:{
                    x: 35,
                    y: 14,
                    angulo: playerBackEnd.canhao.angulo
                },
            })
        }else{
            players[i].posicao.x = playerBackEnd.x
            players[i].posicao.y = playerBackEnd.y
            players[i].canhao.angulo = playerBackEnd.canhao.angulo

        }
    }

    for(const i in players){
        if(!playersBackEnd[i]){
            delete players[i]
        }
    }

    playerLocal.posicao.x = playersBackEnd[socket.id].x
    playerLocal.posicao.y = playersBackEnd[socket.id].y
    playerLocal.canhao.angulo = playersBackEnd[socket.id].canhao.angulo
    
    renderizar()

})

socket.on('updateProjeteis', (projeteisBackEnd)=>{
    projeteis.splice(1, projeteis.length)

    for(const i in projeteisBackEnd){
        const object = new Projetil({
            posicao:{
                x: projeteisBackEnd[i].x,
                y: projeteisBackEnd[i].y,
            },
            estilo: projeteisBackEnd[i].cor
        })
        projeteis.push(object)
    }

    renderizar()

})

let frame = 0
let raio = 15

function renderizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //////TANK//////
    for(const i in players){
        players[i].update()
    }

    projeteis.forEach((projetil)=>{
        projetil.update()
    })
    //////FIM TANK//////

    //GUI
    ctx.font = '30px Pixelify Sans'
    ctx.textAlign = 'left'
    ctx.fillStyle = 'white'
    ctx.fillText('Pontos: ' + pontos, 10, 50)
    ctx.fillText('Vida: ' + players[socket.id].vida, 10, 80)
    
    if(gameOver){
        ctx.font = '100px Pixelify Sans'
        ctx.textAlign='center'
        ctx.fillText('Game over', canvas.width/2, 200)
        ctx.font = '50px Pixelify Sans'
        ctx.fillText('Recarregue a página para reiniciar', canvas.width/2, 300)
    }else if(pause){
        ctx.font = '60px Pixelify Sans'
        ctx.textAlign='center'
        ctx.fillText('Jogo pausado', canvas.width/2, 100)
        ctx.fillText('Aperte P para retomar', canvas.width/2, 180)
    }else{
        //window.requestAnimationFrame(renderizar)

    }
    frameAtual++
}

setInterval(() => {

    let versorVelocidade = {
        x: playerLocal.keys.d + playerLocal.keys.a,
        y: playerLocal.keys.w + playerLocal.keys.s
    }

    if(versorVelocidade.x != 0 || versorVelocidade.y != 0){
        socket.emit('mover', 15* Math.cos(playerLocal.angulo), 15*Math.sin(playerLocal.angulo), playerLocal.mira)

        playerLocal.angulo = Math.atan2(versorVelocidade.y, versorVelocidade.x)
    }

    playerLocal.tempoTiro += 1
    if(playerLocal.tempoTiro%100 == 0){
        socket.emit('atirar')
    }

}, 20)

function distanciaCirculo(circulo1, circulo2) {
    return Math.sqrt(Math.pow(circulo1.posicao.x - circulo2.posicao.x,2)+ Math.pow(circulo1.posicao.y - circulo2.posicao.y,2))
}

function estaNaTela(objeto) {
    return objeto.posicao.x < canvas.width && objeto.posicao.x > 0 && objeto.posicao.y < canvas.height && objeto.posicao.y > 0
}