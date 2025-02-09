
class MyTank extends Entity {
    static objs = [];
    static SHIELD_HIGHEST = 80 ;
    static HIGHEST_HP = 20 ;
    col = [] ;
    row = [] ;
    hp = MyTank.HIGHEST_HP ;
    rotattion = 0 ;
    isGravityBomb = 0 ;
    fromEntityCage = 0 ;
    isBlackHole = 0 ;
    isCage = 0 ;
    BlackHoleRow = 0 ;
    BlackHoleCol = 0 ;
    isMove = true ;
    time = 0 ;
    row = 30 ;
    col = 20 ;
    isShieldON = false ;
    shieldHP = MyTank.SHIELD_HIGHEST ;
    bombBeginTime = 0 ; 
    lastFireTS = 0 ;
    lastFireTS2 = 0 ;
    hightBombLevel = 8 ;
    bombLevelTime = 800 ;
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
        part1.hp = 0 ;
        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.parts.push( part1 ) ;
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 1) {
            this.parts[partIdx].hp-- ;
            if ( this.parts[partIdx].hp <= 0 || fromEntity instanceof BlackHole || fromEntity instanceof CageBomb ) {
                this.shieldHP = 0 ;
                this.isShieldON = false ;
            }
            if (fromEntity instanceof GravityBomb){
                this.isGravityBomb = 8 ;
            }
            if (fromEntity instanceof CageBomb){
                this.fromEntityCage = fromEntity ;
            }
        }
        if ( partIdx == 0 ) {
            this.bombBeginTime = 0 ;
            if (gameControl.audio == 1){
                this.audio.src = "audioFiles/y1491.mp3";
                this.audio.play();
            }
            if (fromEntity instanceof CageBomb){
                this.fromEntityCage = fromEntity ;
            }
            if (fromEntity instanceof GravityBomb){
                this.isGravityBomb = 8 ;
            }
            if (fromEntity instanceof BlackHole){
                    this.BlackHoleRow = fromEntity.row ;
                    this.BlackHoleCol = fromEntity.col ;
                if (this.isBlackHole == 0 ){
                    this.isBlackHole = 80 ;
                }
            }else{
                if (fromEntity instanceof Missile){
                    if (this.isBlackHole == 0 ){
                        this.hp-= 5 ;
                    }
                }else{
                    this.hp-- ;
                }
            }
        }
        
        if (!fromEntity instanceof BlackHole){
            this.moveInBoundary( this.row+1, this.col ) ;
        }
    }
    hpReply() {
        if ( Date.now() - this.lastFireTS2 > 200 ) {
            this.lastFireTS2 = Date.now() ;
            if ( this.hp <MyTank.HIGHEST_HP ) {
                this.hp += 1 ;
                // this.hp = MyTank.HIGHEST_HP ;
            }
        }
    }

    
    getBombLevel() {
        if ( this.bombBeginTime == 0 ) {
            return 0 ;
        }
        let deltaTime = Date.now() - this.bombBeginTime ;  
        let bombLevel = Math.round( deltaTime / this.bombLevelTime ) ;
        if ( bombLevel > this.hightBombLevel ) {
            bombLevel = this.hightBombLevel ;
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
        // this.row[row.length] = this.row ;
        // this.col[row.length] = this.col ;
        if ( Date.now() - this.lastProcessTS < 50 ) {
            this.draw() ;
            this.drawBombLevel() ;
            this.drawHp() ;
            return ;
        }
        this.lastProcessTS = Date.now() ;
        this.hpReply() ;
        if (this.isCage){
            if (this.fromEntityCage.isCage != 80 && this.fromEntityCage.isCage != 0 ){
                this.isMove = false ;
            }else{
                if (this.fromEntityCage.isCage != 0 ){
                    this.fromEntityCage = 0 ;
                }
            }
        }else{
            this.fromEntityCage.isCage != 80 ;
        }
        if ( this.keyController.isArrowRightPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.moveInBoundary( this.row, this.col+1 ) ;
            }
        }
        if ( this.keyController.isArrowLeftPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.moveInBoundary( this.row, this.col-1 ) ;
            }
        }
        if ( this.keyController.isArrowDownPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.moveInBoundary( this.row+1, this.col ) ;
            }
        }
        if ( this.keyController.isArrowUpPressed()) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.moveInBoundary( this.row-1, this.col ) ;
            }
        }
        if ( this.keyController.isButtonAPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.fireBullet();  
            }
        }
        if ( this.keyController.isButtonYPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.fireMyLight();  
            }
        }
        if ( this.keyController.isButtonXPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                this.switchShield();  
            }
        }
        if ( this.keyController.isButtonBPressed() ) {
            if (this.isBlackHole == 0 && this.isMove ){
                if ( this.bombBeginTime == 0 ) {
                    this.bombBeginTime = Date.now() ;
                }
            }
        } else {
            if ( this.bombBeginTime != 0 ) {
                this.fireBomb() ;
            }
        }
        if (this.isGravityBomb > 0 ){
            this.row += 4 ;
            if (this.isGravityBomb <  2 ){ 
                this.hp = 1 ;
            }
            this.isGravityBomb -= 1 ;  
        }
        if (this.isBlackHole != 0 ){
            if (this.isBlackHole > 8 ){
                if (this.row > this.BlackHoleRow){
                    this.row-=1 ;
                }else{
                    this.row+=1 ;
                }
                if (this.col > this.BlackHoleCol){
                    this.col-=1 ;
                }else{
                    this.col+=1 ;
                }
            }else{
                if (this.isBlackHole < 8 ){
                    if (this.row > this.BlackHoleRow){
                        this.row+=4 ;
                    }else{
                        this.row-=4 ;
                    }
                    if (this.col > this.BlackHoleCol){
                        this.col+=4 ;
                    }else{
                        this.col-=4 ;
                    }
                }
            }
            this.isBlackHole-=1 ;
            let i = Math.floor(Math.random()*3)-1 ;
            this.hp += i ;
            if (this.isBlackHole < 2 ){
                this.hp = 1 ;
            }
        }
        if (this.row < TOTAL_ROWS/2 ){
            this.row = TOTAL_ROWS/2+1 ;
        }
        if (this.row > TOTAL_ROWS ){
            this.row = TOTAL_ROWS-1 ;
        }
        if (this.col < 0 ){
            this.col = 1 ;
        }
        if (this.col > TOTAL_COLS ){
            this.col = TOTAL_COLS-1 ;
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
            if ( Date.now() - this.lastBulletTime > 200 ) {
                for ( let i=0;i<4;i++ ){
                    new OurBullet(this.row,this.col,0) ;
                }
                if (gameControl.audio == 1){
                    this.bulletAudio.src = "audioFiles/y2271.mp3";
                }
                this.bulletAudio.pause(); 
                this.bulletAudio.currentTime = 0;
                if (gameControl.audio == 1){
                    this.bulletAudio.play();
                }
                this.lastBulletTime = Date.now() ;
            }
        }
    }
    fireMyLight() {
        this.bombBeginTime = 0;
        if ( this.parts[1].hp <= 0 ) {
            if ( Date.now() - this.lastBulletTime > 200 ) {
                for( let j=0; j<4; j++ ) {
                    new MyLight(this.row,this.col,0) ;
                }
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
        drawImg( "M.tankImg2", x, y, CELL_SIZE*2, CELL_SIZE*2, 0 ) ;
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
        ctx.font = `${CELL_SIZE/4*3}px Arial`;
        ctx.textAlign = "center" ;
        ctx.fillText(`${this.hp}`,this.col*CELL_SIZE+CELL_SIZE/2,(this.row+2)*CELL_SIZE );
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
    lastFireBombTS = Date.now() ;
    lastMoveTS = Date.now() ;
    moveDelayTime = 100 ;
    stopTime = 2000 ; //移動完停多久

    bulletDetect(range) {
        for (let i=0;i<EnemyTank.objs.length;i++){
            if (EnemyTank.objs[i] instanceof BigTank ){
                let j = Math.abs(EnemyTank.objs[i].col-this.col)
                if (j<6 && !this.keyController.isButtonBPressed()){
                    this.autoFireBomb() ;
                    return true ;
                }
            }
        }
        for( let i=0; i<EnemyBullet.objs.length; i++ ) {
            let bullet = EnemyBullet.objs[i] ;
            const dx = bullet.col - this.col;
            const dy = bullet.row - this.row;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if ( dist <= range ) {
                return true ;
            }
        }
        return false ;
    }
    whereIsEmemyCol() {
        let col = this.col;
        let dist = 999 ;
        for( let i=0; i<EnemyTank.objs.length; i++ ) {
            let tank = EnemyTank.objs[i] ;
            if ( Math.abs(tank.col-this.col) < dist ) {
                dist = Math.abs(tank.col-this.col) ;
                col = tank.col ;
            }
        }
        return col ;
    }
    whereIsEmemyCol2() {
        if ( EnemyTank.objs.length == 0 ){
            return this.col ;
        }
        let idx = Math.floor(Math.random()*EnemyTank.objs.length) ;
        return EnemyTank.objs[idx].col ;
    }
    move() {
        if ( Date.now() - this.lastMoveTS < this.moveDelayTime ) {
            return ;
        }
         if ( this.moveDistance-- <= 0 ) {
            if (Date.now() - this.lastMoveTS > this.stopTime ) {
                //this.moveDistance = Math.floor( Math.random() * 20 ) ;
                //this.moveDirection = Entity.DirectionMap[ Math.floor( Math.random() * 4 ) ];
                let col = this.whereIsEmemyCol2() ;
                if ( col > this.col ) {
                    this.moveDirection = 90 ;
                } else {
                    this.moveDirection = 270 ;
                }
                this.moveDistance = Math.abs( this.col - col ) ;
                
                if ( this.row >= TOTAL_ROWS - Math.floor( Math.random() * 10 )+3 ) {
                    this.moveDirection = 0 ;
                    this.moveDistance = Math.floor( Math.random() * 10 ) + 3 ;
                }
            }
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
    autoFireBullet() {
        if ( Date.now() - this.lastFireTS > 500 ) {
                if ( this.keyController.isButtonBPressed() ) {
                    return ;
                }  
            if (Math.floor(Math.random()*2) == 0 ){
                this.keyController.keyPress(this.keyController.keyCodeToA, 70 ) ;
            }else{
                this.keyController.keyPress(this.keyController.keyCodeToY, 70 ) ;
            }
            this.lastFireTS = Date.now() ;
        }
    }
    autoFireBomb() {
        if ( Date.now() - this.lastFireBombTS > 8000 ) {
            this.keyController.keyPress(this.keyController.keyCodeToB, (Math.floor(Math.random()*this.hightBombLevel-1)+1)*1000) ;
            this.lastFireBombTS = Date.now() ;
        }
    }
    process() {
        super.process();
        this.move();
        if ( this.bulletDetect(3) ) {
            if ( this.isShieldON == false ) {
                this.switchShield() ;
            }
        } else {
            if ( this.isShieldON == true ) {
                if ( !this.keyController.isButtonBPressed() ) {
                    this.switchShield() ;
                }
            }
            if ( Math.floor( Math.random() * 10) == 0 ) {
                this.autoFireBomb() ;
            } else {
                this.autoFireBullet() ;
            }
        }
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