
class MyTank extends Entity {
    static totalTanks = 0 ;
    static SHIELD_HIGHEST = 20 ;
    static HIGHEST_HP = 8 ;
    hp = MyTank.HIGHEST_HP ;
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
        this.tankId = MyTank.totalTanks++ ;
        this.keyController = keyController ;
        this.row = row ;
        this.col = col ;
        this.audio = document.createElement("audio");
        this.bombAudio = document.createElement("audio");
        this.bulletAudio = document.createElement("audio");
    }
    init() {
        this.spaceBoundary.top = 20;
        this.spaceBoundary.bottom = TOTAL_ROWS-1;
        this.spaceBoundary.left = 0;
        this.spaceBoundary.right = TOTAL_COLS-1;

        let part0 = new Part() ;
        part0.add(0,0) ;

        let part1 = new Part() ;
        part1.add(-2,0).add(-2,-1).add(-2,1).add(-1,-2).add(-1,2) ;
        part1.hp=0 ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.parts.push( part1 ) ;
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 1) {
            this.parts[partIdx].hp--;
        }
        if ( partIdx == 0 ) {
            this.bombBeginTime = 0 ;
            this.audio.src = "audioFiles/y1491.mp3";
            this.audio.play();
            this.hp-- ;
        }
    }

    getBombLevel() {
        if ( this.bombBeginTime == 0 ) {
            return 0 ;
        }
        let deltaTime = Date.now() - this.bombBeginTime ;  
        let bombLevel = Math.round( deltaTime / 2000 ) ;
        if ( bombLevel > 8 ) {
            bombLevel = 8 ;
        }
        return bombLevel ;
    }

    fireBomb() {
        let bombLevel = this.getBombLevel() ;
        if ( bombLevel == 0 ) {
            return ;
        }

        let rowCount = bombLevel+(bombLevel-1) ;
        let deltaCol = 0 ;

        for( let row=0; row<rowCount; row++ ) {
            let colCount = Math.abs(deltaCol)*2+1  ;
            //console.log( `${deltaCol}, ${colCount}` ) ;
            for( let col=0; col<colCount; col++ ) {
                tanks.push( new MyBomb( this.row-rowCount+row, this.col+deltaCol+col )) ;
            }
            if ( row >= bombLevel-1 ) {
                deltaCol++ ;
            } else {
                deltaCol-- ;
            }
        }
        if (bombLevel>1){
            tanks.push( new Light( this.row , this.col , rowCount*CELL_SIZE , rowCount*CELL_SIZE )) ;
        } else {
            this.bombAudio.src = "audioFiles/y2271.mp3";
            this.bombAudio.play();
        }
        this.bombBeginTime = 0 ;
    }

    process() {
        if ( Date.now() - this.lastProcessTS < 50 ) {
            this.draw() ;
            return ;
        }
        this.lastProcessTS = Date.now() ;
        if ( this.keyController.isArrowRightPressed() ) {
            this.moveIfPermitted( this.row, this.col+1 ) ;
        }
        if ( this.keyController.isArrowLeftPressed() ) {
            this.moveIfPermitted( this.row, this.col-1 ) ;
        }
        if ( this.keyController.isArrowDownPressed() ) {
            this.moveIfPermitted( this.row+1, this.col ) ;
        }
        if ( this.keyController.isArrowUpPressed()) {
            this.moveIfPermitted( this.row-1, this.col ) ;
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
        if ( Date.now() - this.lastShieldSwitchTime < 100 ) {
            return ;
        }
        console.log("switchShield()");
        this.bombBeginTime = 0;
        this.lastShieldSwitchTime = Date.now() ;

        this.isShieldON = !this.isShieldON ;
        if ( this.isShieldON ) {
            if ( this.shieldHP <=0 ) {
                this.parts[1].hp = 8 ;
            } else {
                this.parts[1].hp = this.isShieldON ;
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
            let color = 255/MyTank.SHIELD_HIGHEST*this.shieldHP ;
            ctx.fillStyle = `rgb(${color},${color},${color})` ;
            ctx.fillRect( (this.col-2)*CELL_SIZE+1, (this.row-1)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            ctx.fillRect( (this.col-1)*CELL_SIZE+1, (this.row-2)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            ctx.fillRect( (this.col+1)*CELL_SIZE+1, (this.row-2)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            ctx.fillRect( (this.col+2)*CELL_SIZE+1, (this.row-1)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
            y = ((this.row-2)*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "M.shieldImg", x, y, CELL_SIZE*2, CELL_SIZE*2, 180 ) ;
        }   
        ctx.fillStyle = `rgb(255,0,0)` ;
        for( let i=0; i<this.hp; i++ ) {
            ctx.fillRect( (this.col-1)*CELL_SIZE, (this.row*CELL_SIZE)+20-i*4, 3, 3 ) ;
        }

        let bombLevel = this.getBombLevel() ;
        ctx.fillStyle = `rgb(0,255,255)` ;
        for( let i=0; i<bombLevel; i++ ) {
            ctx.fillRect( (this.col-1)*CELL_SIZE+5, (this.row*CELL_SIZE)+20-i*4, 3, 3 ) ;
        }
    }
}

class AutoMyTank extends MyTank {

    process() {
        if ( this.isShieldON == true ) {
            this.switchShield() ;
        }
        this.fireBullet() ;
        this.switchShield() ;

        let dir = Math.floor( Math.random() * 4) ;
        switch( dir ) {
            case 0:
                this.keyUp() ;
                break;
            case 1:
                this.keyRight() ;
                break;
            case 2:
                this.keyDown() ;
                break;
            case 3:
                this.keyLeft() ; 
                break;
        }

        this.checkIfUnderAttack() ;
        this.drawMyCell() ;
    }
}


class MyBomb{
    row = 0 ;
    col = 0 ;
    hp = 20 ;
    constructor(row,col) {
        this.row = row ;
        this.col = col ;
    }
    
    process(){
        if ( this.hp==0 ) {
            return ;
        }
        this.row-=1 ;    
        if (this.row<0){
            this.hp=0 ; 
        }
        for (let i=0;i<tanks.length;i++){
            if ( (tanks[i] instanceof Tank) ){
                if ( tanks[i].attack( this.row, this.col ) ) {
                    if (!tanks[i] instanceof Light ){
                        this.hp = 0 ;
                    return ;
                    }
                } 
            }
        }
        
        
    }

}
class Light extends MyBomb{
    rotation = 0 ;
    constructor(row,col,width,height) {
        super(row,col) ;
        this.width=width ;
        this.height = height ;
    }
    process(){
        if ( this.hp<0 ) {
            return ;
        }
        this.row-=1 ;
        if ((this.row+((this.height+1)/2))<0){
            this.hp=0 ; 
        }
        this.drawBulletCell() ;
        for (let i=0;i<tanks.length;i++){
            if (!(tanks[i] instanceof  Bullet)  && !(tanks[i] instanceof  MyBullet) && !(tanks[i] instanceof MyBomb)&& !(tanks[i] instanceof  Light)){
                if (!tanks[i] instanceof firstAidKit){
                    if ( tanks[i].attack( this.row, this.col ) ) {
                        if (!tanks[i] instanceof Light ){
                            this.hp = 0 ;
                            return ;
                        }
                    } 
                }
            }
        }
        
        
    }
    drawBulletCell(){
//        console.log(this.row);
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "lightImg", x, y, this.width*5/4, this.height*5/4, this.rotation ) ;
//        console.log(`${this.width},${this.width}`);
        this.rotation+= 20 ;
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
    }
}