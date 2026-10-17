

// canvas.addEventListener('click', (e)=>{
    //     let velocidade = 10
    //     let projetil = new Projetil({
        //         posicao:{
            //             x: playerTank.posicao.x + playerTank.canhao.x*Math.cos(playerTank.canhao.angulo),
            //             y: playerTank.posicao.y + playerTank.canhao.x*Math.sin(playerTank.canhao.angulo)
            //         },
            //         velocidade:{
                //             x: velocidade*Math.cos(playerTank.canhao.angulo),
                //             y: velocidade*Math.sin(playerTank.canhao.angulo)
                //         }
                //     })
                //     projeteis.push(projetil)
                // })
                
                // addEventListener('keydown', (e) => {
                    
                    //     switch (e.key) {
                        //         case 'w':
//             players[socket.id].keys.w = -1

//             break;
//         case 's':
//             players[socket.id].keys.s = 1

//             break;
//         case 'a':
//             players[socket.id].keys.a = -1

//             break;
//         case 'd':
//             players[socket.id].keys.d = 1

//             break;
//         default:
//             break;
//     }
// })

// addEventListener('keyup', (e)=>{
    //     switch (e.key) {
        //         case 'w':
        //             players[socket.id].keys.w = 0
        //             break;
        //         case 's':
        //             players[socket.id].keys.s =0
        //             break;
        //         case 'a':
        //             players[socket.id].keys.a =0
        
        //             break;
        //         case 'd':
        //             players[socket.id].keys.d =0
        
        //             break;
        //         default:
        //             break;
        //     }
        // })
        
canvas.addEventListener('mousemove', (e)=>{
    playerLocal.mira = {
        x: e.offsetX,
        y: e.offsetY,
    }

    socket.emit('mover', 0, 0, playerLocal.mira)
})

addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'w':
            playerLocal.keys.w = -1
            
            break;
        case 's':
            playerLocal.keys.s = 1
            
            break;
        case 'a':
            playerLocal.keys.a = -1

        break;
        case 'd':
            playerLocal.keys.d = 1

            break;
        default:
        break;
    }
})

addEventListener('keyup', (e)=>{
    switch (e.key) {
        case 'w':
            playerLocal.keys.w = 0
            break;
        case 's':
            playerLocal.keys.s =0
            break;
        case 'a':
            playerLocal.keys.a =0

            break;
        case 'd':
            playerLocal.keys.d =0

            break;
        default:
            break;
    }
})
