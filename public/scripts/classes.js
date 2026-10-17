class Projetil{
    constructor({posicao, estilo,}){
        this.posicao = posicao
        this.raio = 7
        this.estilo = estilo
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = this.estilo
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.draw()
    }
}

class Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
        estilo,
    }){
        this.posicao = posicao,
        this.velocidade = velocidade,
        this.raio = raio
        this.vida = vida
        this.estilo = estilo
        this.indice = 0
        this.angulo = 0
        this.estado = 'move'
        this.raioMorte = 0
    }
    draw(){
        switch (this.estado) {
            case 'move':
                ctx.beginPath()
                ctx.fillStyle = this.estilo
                ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
                ctx.fill()
                ctx.closePath()
                break;

            case 'morte':
                ctx.beginPath()
                ctx.fillStyle = this.estilo
                if(this.raioMorte < this.raio){
                    this.raioMorte++
                    this.raio+=0.5
                }else{
                    inimigos.splice(this.indice, 1)
                }
                ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
                ctx.arc(this.posicao.x, this.posicao.y, this.raioMorte, 0, -Math.PI*2, true)
                ctx.fill()
                ctx.closePath()
                break;
            default:
                break;
        }
    }
}

class InimigoRed extends Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
        estilo
    }){
        super({
            posicao,
            velocidade,
            raio,
            vida,
            estilo
        })
    }
    update(){
        this.draw()

        if(!seColisao(
                this.posicao.x + this.velocidade*Math.cos(this.angulo),
                this.posicao.y + this.velocidade*Math.sin(this.angulo),
                this
            ))
        {
            this.posicao.x += this.velocidade*Math.cos(this.angulo)
            this.posicao.y += this.velocidade*Math.sin(this.angulo)
        }
        this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
    }
}

class InimigoBlue extends Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
        estilo
    }){
        super({
            posicao,
            velocidade,
            raio,
            vida,
            estilo
        })
    }
    update(){
        this.draw()

        if(distanciaCirculo(this, playerTank)>300){
            if(!seColisao(
                    this.posicao.x + this.velocidade*Math.cos(this.angulo),
                    this.posicao.y + this.velocidade*Math.sin(this.angulo),
                    this
                ))
            {   

                this.posicao.x += this.velocidade*Math.cos(this.angulo)
                this.posicao.y += this.velocidade*Math.sin(this.angulo)
            }

        }else{
            if(frameAtual%120 == 0){
                let velocidade = 3
                let projetil = new Projetil({
                    posicao:{
                        x: this.posicao.x,
                        y: this.posicao.y
                    },
                    velocidade:{
                        x: velocidade*Math.cos(this.angulo),
                        y: velocidade*Math.sin(this.angulo)
                    },
                    estilo: 'blue',
                    seInimigo: true
                })
                projeteis.push(projetil)
            }
        }

        this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
    }
}

class InimigoYellow extends Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
        estilo
    }){
        super({
            posicao,
            velocidade,
            raio,
            vida,
            estilo
        })
    }
    update(){
        this.draw()

        if(distanciaCirculo(this, playerTank)>600){
            if(!seColisao(
                    this.posicao.x + this.velocidade*Math.cos(this.angulo),
                    this.posicao.y + this.velocidade*Math.sin(this.angulo),
                    this
                ))
            {   

                this.posicao.x += this.velocidade*Math.cos(this.angulo)
                this.posicao.y += this.velocidade*Math.sin(this.angulo)
            }

        }else{
            if(frameAtual%120 == 0){
                let velocidade = 5
                let projetil = new Projetil({
                    posicao:{
                        x: this.posicao.x,
                        y: this.posicao.y
                    },
                    velocidade:{
                        x: velocidade*Math.cos(this.angulo),
                        y: velocidade*Math.sin(this.angulo)
                    },
                    estilo: this.estilo,
                    seInimigo: true
                })
                projeteis.push(projetil)
            }
        }

        this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
    }
}

class ItemBoost{
    constructor({posicao}){
        this.posicao = posicao
        this.estado = 'nao pegado'
        this.tempoBoost = {
            atual: 0,
            max: 180
        }
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'green'
        ctx.arc(this.posicao.x, this.posicao.y, 7, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        if(this.estado == 'nao pegado'){
            this.draw()
            if(distanciaCirculo(this, playerTank)<playerTank.raio+5){
                this.estado = 'pegado'
            }
        }else if(this.estado == 'pegado'){
            if(this.tempoBoost.atual< this.tempoBoost.max){
                playerTank.tempoTiro = 2
                this.tempoBoost.atual++
            }else{
                playerTank.tempoTiro = 1
                const indice = items.indexOf(this)
                //items.splice(indice, 1)
            }
            
        }
        
    }
}

class ItemExplosao{
    constructor({posicao}){
        this.posicao = posicao
        this.estado = 'nao pegado'
        this.raioExplosao ={
            atual: 0,
            max: 300
        }
        this.raioNegatico = 0
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = '#bbbbbb'
        ctx.arc(this.posicao.x, this.posicao.y, 7, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        if(this.estado == 'nao pegado'){
            this.draw()
            if(distanciaCirculo(this, playerTank)<playerTank.raio+5){
                this.estado = 'pegado'
            }
        }else if(this.estado == 'pegado'){
            //if(this.raioNegatico<this.raioExplosao.max)
            if(this.raioExplosao.atual>=this.raioNegatico){
                ctx.beginPath()
                ctx.fillStyle = '#ffffff'
                ctx.arc(this.posicao.x, this.posicao.y, this.raioExplosao.atual, 0, Math.PI*2)
                if(this.raioExplosao.atual>150){
                    ctx.arc(this.posicao.x, this.posicao.y, this.raioNegatico, 0, Math.PI*2, true)
                    this.raioNegatico+=13
                }
                ctx.fill()
                ctx.closePath()
                this.raioExplosao.atual+=7
            }else{
                const indice = items.indexOf(this)
                items.splice(indice, 1)
            }
            
        }
        
    }
}

class Particula{
    constructor({posicao}){
        this.posicao = posicao
        this.raio = 15
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = '#dddddd80'
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.draw()
        if(this.raio>0.4){
            this.raio-=0.4
        }else{
            const indice = particulasPlayer.indexOf(this)
            particulasPlayer.splice(indice, 1)
        }
    }
}

class Player{
    constructor({posicao, raio, velocidade, cor, canhao, }){
        this.posicao = posicao
        this.raio = raio
        this.velocidadePadrao = velocidade
        this.cor = cor
        this.canhao = canhao
        this.angulo = 0
        this.vida = 10
        this.tempoTiro = 100
        this.keys = {
            w: 0,
            s: 0,
            a: 0,
            d: 0,
        },
        this.tempoTiro = 0

    }
    draw(){
        ctx.beginPath()//desenha tank
        ctx.fillStyle = this.cor
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.save()
            ctx.translate(this.posicao.x, this.posicao.y)
            ctx.rotate(this.canhao.angulo)
            ctx.rect(0, 0 - this.canhao.y/2, this.canhao.x, this.canhao.y)
        ctx.restore()
        ctx.fill()
    ctx.closePath()
    }
    update(){
        this.draw()

        //  let versorVelocidade = {
        //     x:this.keys.d + this.keys.a,
        //     y: this.keys.w + this.keys.s
        // }
    
        // if(versorVelocidade.x != 0 || versorVelocidade.y != 0){
        //     socket.emit('mover', this.velocidadePadrao* Math.cos(this.angulo), this.velocidadePadrao*Math.sin(this.angulo))

        //     this.angulo = Math.atan2(versorVelocidade.y, versorVelocidade.x)
        // }
    }
}

function seColisao(x, y, ignore) {
    let retorno = false
    inimigos.forEach(inimigo => {
        if(inimigo!=ignore){
            if(
                Math.sqrt(Math.pow(x- inimigo.posicao.x ,2) + Math.pow(y-inimigo.posicao.y, 2)) < inimigo.raio + ignore.raio
            ){
                retorno = true;
                return
            }
        }
    });
    return retorno
}