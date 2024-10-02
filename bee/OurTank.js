
class MyTank extends Entity {
    static objs = [];
    static SHIELD_HIGHEST = 20 ;
    static HIGHEST_HP = 8 ;
    hp = MyTank.HIGHEST_HP ;
    rotattion = 0 ;
    time = 0 ;
    row = 30 ;
    col = 20 ;
    isShieldON = false ;
    shieldHP = MyTank.SHIELD_HIGHEST ;
    bombBeginTime = 0 ; 
    lastBulletTime = 0 ;
    lastShieldSwitchTime = 0 ;
    lastProcessTS = Date.now();
    constructor(row, col, keyController ) {
        super( row, col, 0 ) ;
        this.spaceBoundary.top = 20;
        this.spaceBoundary.bottom = TOTAL_ROWS-1;
        this.spaceBoundary.left = 0;
        this.spaceBoundary.right = TOTAL_COLS-1;

        this.tankId = MyTank.objs.length ;
        this.keyController = keyController ;
        this.row = row ;
        this.col = col ;
        this.audio = document.createElement("audio");
        this.bombAudio = document.createElement("audio");
        this.bulletAudio = document.createElement("audio");
        MyTank.objs.push(this) ;
    }

    static process() {
        for( let i=0; i<MyTank.objs.length; i++ ) {
            if ( MyTank.objs[i].hp <= 0 ) {
                MyTank.objs.splice( i--, 1 ) ;
            } else {
                MyTank.objs[i].process() ;
            }
        }
    }

    init() {

        let part0 = new Part() ;
        part0.add(0,0) ;

        let part1 = new Part() ;
        part1.add(-2,0).add(-2,-1).add(-2,1).add(-1,-2).add(-1,2).add(0,-2).add(0,2).add(2,0).add(2,-1).add(2,1).add(1,-2).add(1,2).add(-1,-1).add(-1,).add(-1,1).add(0,2).add(0,1).add(1,-1).add(1,0).add(1,1) ;
        part1.hp=0 ;
        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.parts.push( part1 ) ;
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 1) {
            this.parts[partIdx].hp-- ;
            if ( this.parts[partIdx].hp <= 0 ) {
                this.shieldHP = 0 ;
                this.isShieldON = false ;
            }
        }
        if ( partIdx == 0 ) {
            this.bombBeginTime = 0 ;
            this.audio.src = "audioFiles/y1491.mp3";
            this.audio.play();
            this.hp-- ;
        }
        this.moveInBoundary( this.row+1, this.col ) ;
    }

    getBombLevel() {
        if ( this.bombBeginTime == 0 ) {
            return 0 ;
        }
        let deltaTime = Date.now() - this.bombBeginTime ;  
        let bombLevel = Math.round( deltaTime / 1000 ) ;
        if ( bombLevel > 8 ) {
            bombLevel = 8 ;
        }
        return bombLevel ;
    }

    fireBomb() {
        let bombLevel = this.getBombLevel() ;
        this.bombBeginTime = 0 ;
        if ( bombLevel == 0 ) {
            return ;
        }

        new OurBomb( this.row, this.col, bombLevel ) ;
    }

    process() {
        if ( Date.now() - this.lastProcessTS < 50 ) {
            this.draw() ;
            this.drawBombLevel() ;
            this.drawHp() ;
            return ;
        }
        this.lastProcessTS = Date.now() ;

        if ( this.keyController.isArrowRightPressed() ) {
            this.moveInBoundary( this.row, this.col+1 ) ;
        }
        if ( this.keyController.isArrowLeftPressed() ) {
            this.moveInBoundary( this.row, this.col-1 ) ;
        }
        if ( this.keyController.isArrowDownPressed() ) {
            this.moveInBoundary( this.row+1, this.col ) ;
        }
        if ( this.keyController.isArrowUpPressed()) {
            this.moveInBoundary( this.row-1, this.col ) ;
        }
        if ( this.keyController.isButtonAPressed() ) {
            this.fireBullet();  
        }
        if ( this.keyController.isButtonXPressed() ) {
            this.switchShield();  
        }
        if ( this.keyController.isButtonBPressed() ) {
            if ( this.bombBeginTime == 0 ) {
                this.bombBeginTime = Date.now() ;
            }
        } else {
            if ( this.bombBeginTime != 0 ) {
                this.fireBomb() ;
            }
        }
        this.draw() ;
        this.drawBombLevel() ;
        this.drawHp() ;
    }
    checkFirstAidKit(){
        for( let i=0; i<tanks.length; i++ ) {
            if (tanks[i] instanceof firstAidKit){
                if (this.row==tanks[i].row&&this.col==tanks[i].col){
                    this.hp+=3 ;
                    if (this.hp >MyTank.HIGHEST_HP){
                        this.hp = MyTank.HIGHEST_HP ;
                    }
                    tanks[i].hp = 0 ;
                }
            }
        }
    }
    fireBullet() {
        this.bombBeginTime = 0;
        if ( this.parts[1].hp <= 0 ) {
            if ( Date.now() - this.lastBulletTime > 300 ) {
                new OurBullet(this.row,this.col,0) ;
                this.bulletAudio.src = "audioFiles/y2271.mp3";
                this.bulletAudio.pause(); 
                this.bulletAudio.currentTime = 0;
                this.bulletAudio.play();
                this.lastBulletTime = Date.now() ;
            }
        }
    }
    switchShield() {
        if ( Date.now() - this.lastShieldSwitchTime < 300 ) {
            return ;
        }
        this.bombBeginTime = 0;
        this.lastShieldSwitchTime = Date.now() ;

        this.isShieldON = !this.isShieldON ;
        if ( this.isShieldON ) {
            if ( this.shieldHP <=0 ) {
                this.parts[1].hp = MyTank.SHIELD_HIGHEST ;
            } else {
                this.parts[1].hp = this.shieldHP ;
            }
        } else {
            this.shieldHP = this.parts[1].hp ;
            this.parts[1].hp = 0 ;
        }
    }

    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "M.tankImg", x, y, CELL_SIZE*2, CELL_SIZE*2, 0 ) ;
        if (this.isShieldON  ){
            let color = 50+10*this.parts[1].hp ;
            x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
            y = ((this.row)*CELL_SIZE+1) + CELL_SIZE/2 ;
            this.rotation+= (this.parts[1].hp)*2 ;
            drawImg( "shieldImg", x, y, CELL_SIZE*8, CELL_SIZE*8, this.rotation ) ;
        }
    }
    drawBombLevel(){
        let bombLevel = this.getBombLevel() ;
        ctx.fillStyle = `rgb(0,255,255)` ;
        let l = 0 ; 
        let k = Math.floor(Math.sqrt(bombLevel)) ;
        let p = bombLevel-k*k ;
        for( let j=0; j<k; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                ctx.fillRect( (this.col+2)*CELL_SIZE+(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
            }
        }
        for( let j=0; j<10; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                if ( p == 0 ){
                    return ; ;
                }
                ctx.fillRect( (this.col+2)*CELL_SIZE+(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
                p-- ;
            }
        }
    }
    drawHp(){
        ctx.fillStyle = `rgb(255,0,0)` ;
        let l = 0 ; 
        let k = Math.floor(Math.sqrt(this.hp)) ;
        let p = this.hp-k*k ;
        for( let j=0; j<k; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                ctx.fillRect( (this.col-1)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
            }
        }
        for( let j=0; j<10; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                if ( p == 0 ){
                    return ; ;
                }
                ctx.fillRect( (this.col-1)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
                p-- ;
            }
        }
    }
}

class AutoMyTank extends MyTank {
    lastFireTS = Date.now() ;
    lastMoveTS = Date.now() ;
    moveDelayTime = 100 ;
    stopTime = 1000 ; //移動完停多久

    move() {
         if ( this.moveDistance-- <= 0 ) {
            if (Date.now() - this.lastMoveTS > this.stopTime ) {
                this.moveDistance = Math.floor( Math.random() * 20 ) ;
                this.moveDirection = Entity.DirectionMap[ Math.floor( Math.random() * 4 ) ];
                //console.log(`新方向 ${this.moveDirection}, ${this.moveDistance}`);
            }
            return ;
        }
        if ( Date.now() - this.lastMoveTS < this.moveDelayTime ) {
            return ;
        }
        let isMove = false ;
        switch( this.moveDirection ) {
            case 0:
                isMove = this.moveInBoundary( this.row-1, this.col ) ;
                break;
            case 90:
                isMove = this.moveInBoundary( this.row, this.col+1 ) ;
                break;
            case 180:
                isMove = this.moveInBoundary( this.row+1, this.col ) ;
                break;
            case 270:
                isMove = this.moveInBoundary( this.row, this.col-1 ) ;
                break;
        }
        if ( isMove ) {
            this.lastMoveTS = Date.now() ;
        } else {
            this.moveDistance = 0 ;
        }

    }
    process() {
        if ( Date.now() - this.lastProcessTS < 50 ) {
            this.draw() ;
            this.drawBombLevel() ;
            this.drawHp() ;
            return ;
        }
        this.lastProcessTS = Date.now() ;

        if ( this.isShieldON == true ) {
            this.switchShield() ;
        }
        this.move() ;
        this.fireBullet() ;
        this.switchShield() ;

        this.draw() ;
        this.drawBombLevel() ;
        this.drawHp() ;
    }
}

class firstAidKit{
    row = (TOTAL_ROWS/2)+Math.floor(Math.random()*(TOTAL_ROWS/2)) ;
    col = +Math.floor(Math.random()*TOTAL_COLS) ;
    hp = 1 ;
    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "firstaidkit", x, y, CELL_SIZE*3/2, CELL_SIZE*3/2, 0 ) ;
    }
    process(){
        this.draw() ;
        this.drawBombLevel() ;
        this.drawHp() ;
    }
}