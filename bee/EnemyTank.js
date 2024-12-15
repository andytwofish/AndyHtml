

class EnemyTank extends Entity {
    static objs = [] ;
    lastFireTS = Date.now() ;
    lastMoveTS = Date.now() ;
    moveDelayTime = 100 ;
    stopTime = 1000 ; //移動完停多久
    hp = 3 ;
    constructor() {
        super( 0, 0, 180 ) ;
        this.spaceBoundary.top = 0;
        this.spaceBoundary.bottom = 19;
        this.spaceBoundary.left = 0;
        this.spaceBoundary.right = TOTAL_COLS-1;
        let coord = this.getRandomLocation(); //spaceBoundary setting first
        this.row = coord.row ;
        this.col = coord.col ;
        EnemyTank.objs.push(this) ;
    }
    static process() {
        for( let i=0; i<EnemyTank.objs.length; i++ ) {
            if ( EnemyTank.objs[i].hp <= 0 ) {
                EnemyTank.objs.splice( i--, 1 ) ;
            } else {
                EnemyTank.objs[i].process() ;
            }
        }
    }
    init() {

        let part0 = new Part() ;
        part0.add(0,0) ;
        part0.fillStyle = "rgb(100,0,0)" ;

        let part1 = new Part() ;
        part1.add(0,-1).add(0,1).add(0,2).add(0,-2) ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
        //this.parts.push( part1 ) ;

    }

    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "tankImg", x, y, CELL_SIZE*3/2, CELL_SIZE*3/2, 180 ) ;
        this.drawHp() ;
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

    move() {
        if ( this.moveDistance-- <= 0 ) {
            if (Date.now() - this.lastMoveTS > this.stopTime ) {
                this.moveDistance = Math.floor( Math.random() * 20 ) ;
                this.moveDirection = Entity.DirectionMap[ Math.floor( Math.random() * 5 ) ];
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
        super.process() ;
        if ( Date.now() - this.lastFireTS > 1000 ) {
            this.lastFireTS = Date.now() ;
            new EnemyBullet(this.row, this.col, 180) ;
        }

    }
}

class ShieldPeople extends EnemyTank {
    lastShieldTS = 0 ;
    hp = 1 ;

    init() {
        let part0 = new Part() ;
        part0.add(0,0) ;

        let part1 = new Part() ;
        part1.add(1,-2).add(2,-1).add(2,0).add(2,1).add(1,2) ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.parts.push( part1 ) ;
    }

    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "peopleImg", x, y, CELL_SIZE*3/2, CELL_SIZE*3/2, 180 ) ;
    
        if ( this.parts[1].hp > 0 ){
            ctx.fillStyle = `rgb(100,100,0)` ;
            ctx.fillRect( (this.col-2)*CELL_SIZE+1, (this.row+1)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            ctx.fillRect( (this.col-1)*CELL_SIZE+1, (this.row+2)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            ctx.fillRect( (this.col+1)*CELL_SIZE+1, (this.row+2)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            ctx.fillRect( (this.col+2)*CELL_SIZE+1, (this.row+1)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
            y = ((this.row+2)*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "E.shieldImg", x, y, CELL_SIZE*3/2, CELL_SIZE*3/2, 0 ) ;
        }
        this.drawHp() ;
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 0) {
            this.hp = 0 ;
        } else if ( partIdx == 1 ) {
            this.parts[partIdx].hp-- ;
        }
    }

    process(){
        if (this.parts[1].hp > 0 ){
            this.lastShieldTS = Date.now() ;
        } else {
            if ( Date.now() - this.lastShieldTS > 3000 ) {
                this.parts[1].hp = 1 ;
            }
        }
        this.move() ;
        this.draw() ;
    }

}

class SuperTank extends EnemyTank { 
    hp = 8 ;
    init() {

        let part0 = new Part() ;
        part0.add(0,0).add(0,-1).add(0,-2).add(0,-3).add(0,-4).add(0,1).add(0,2).add(0,3).add(0,4) ;
        part0.add(-1,0).add(-1,-1).add(-1,1) ;

        let part1 = new Part() ;
        part1.add(1,-4) ;

        let part2 = new Part() ;
        part2.add(1,-2) ;

        let part3 = new Part() ;
        part3.add(1,0) ;

        let part4 = new Part() ;
        part4.add(1,2) ;

        let part5 = new Part() ;
        part5.add(1,4) ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.parts.push( part1 ) ;
        this.parts.push( part2 ) ;
        this.parts.push( part3 ) ;
        this.parts.push( part4 ) ;
        this.parts.push( part5 ) ;
    }

    draw(){
        this.autoDraw() ;
        this.drawHp() ;
    }

    drawHp(){
        ctx.fillStyle = `rgb(255,0,0)` ;
        let l = 0 ; 
        let k = Math.floor(Math.sqrt(this.hp)) ;
        let p = this.hp-k*k ;
        for( let j=0; j<k; j++ ) {
            l++ ; 
            for( let i=0; i<k; i++ ) {
                ctx.fillRect( (this.col-5)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
            }
        }
        for( let j=0; j<10; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                if ( p == 0 ){
                    return ; ;
                }
                ctx.fillRect( (this.col-5)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
                p-- ;
            }
        }
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 0) {
            this.hp-=1 ;
            for( let i=1; i<this.parts.length; i++) {
                if ( this.parts[i].hp > 0 ) {
                    this.hp = 8 ;
                }
            }
        } else {
            this.parts[partIdx].hp = 0 ;
        }
    }

    process(){
        if ( Date.now() - this.lastFireTS > 2800 ) {
            this.lastFireTS = Date.now() ;
            for( let i=1; i<this.parts.length; i++ ) {
                if ( this.parts[i].hp > 0 ) {
                    new EnemyBullet(this.row+1,this.col+this.parts[i].coords[0].col, 180 ) ;
                }
            }
        }
        this.move() ;
        this.draw() ;
    }

}
class LaserLightTank extends SuperTank{
    hp = 20 ;
    init() {
        let part0 = new Part() ;
        part0.add(-1,-1).add(-1,0).add(-1,1).add(0,-1).add(0,0).add(0,1).add(1,-1).add(1,1).add(-2,0).add(0,-2).add(0,2).add(-2,0).add(-3,-1).add(-3,0).add(-3,1) ;
        this.parts = [] ;
        this.parts.push( part0 ) ;
    }

    draw(){
        this.autoDraw() ;
        this.drawHp() ;
    }

    drawHp(){
        ctx.fillStyle = `rgb(255,0,0)` ;
        let l = 0 ; 
        let k = Math.floor(Math.sqrt(this.hp)) ;
        let p = this.hp-k*k ;
        for( let j=0; j<k; j++ ) {
            l++ ; 
            for( let i=0; i<k; i++ ) {
                ctx.fillRect( (this.col-2)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
            }
        }
        for( let j=0; j<10; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                if ( p == 0 ){
                    return ; ;
                }
                ctx.fillRect( (this.col-2)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
                p-- ;
            }
        }
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 0) {
            this.hp-=1 ;
        } else {
            this.parts[partIdx].hp = 0 ;
        }
    }

    process(){
        if ( Date.now() - this.lastFireTS > 400 ) {
            this.lastFireTS = Date.now() ;
            let j = Math.floor(Math.random()*4)+1 ;
            for( let i=0; i<j; i++ ) {
                new LaserLight(this.row+1,this.col, 180 ) ;
            }
        }
        this.move() ;
        this.draw() ;
    }


}
class BigTank extends SuperTank{
    static HIGHEST_HP = 200 ;
    static ONETHIRD_HP = BigTank.HIGHEST_HP/5*1
    hp = BigTank.HIGHEST_HP ;
    lastFireTS = 2000 ;
    lastFireTS2 = 2000 ;
    drawCellHp = (TOTAL_COLS-2)*CELL_SIZE/BigTank.HIGHEST_HP ;
    init() {
        let part0 = new Part() ;
        part0.add(-2,0).add(-2,-1).add(-2,1).add(-1,0).add(-3,0).add(-3,-1).add(-4,0).add(-3,1).add(-2,-2).add(-2,2).add(-1,-1).add(0,0).add(-1,1)    .add(-3,-2).add(-4,-1).add(5,0).add(-4,1).add(-3,2).add(-2,-3).add(-2,3).add(-1,2).add(0,-1).add(1,0).add(0,1).add(-1,2) ;
        let part1 = new Part() ;
        part1.add(0,0).add(-1,-1).add(-1,0).add(-1,1).add(0,-1).add(0,1).add(1,-1).add(1,0).add(1,1) .add(1,-2).add(1,2).add(2,-2).add(2,2).add(3,-2).add(3,2).add(4,-1).add(4,1) ;
        let part2 = new Part() ;
        part2.add(2,0) ;
        part2.fillStyle = "rgb(200,0,0)" ;

        let part3 = new Part() ;
        part3.add(0,-4) ;

        let part4 = new Part() ;
        part4.add(0,4) ;
        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.parts.push( part1 ) ;
        this.parts.push( part2 ) ;
        this.parts.push( part3 ) ;
        this.parts.push( part4 ) ;
    }
    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 0) {
            this.hp-- ;
            for( let i=1; i<this.parts.length; i++) {
                if ( this.parts[i].hp > 0 ) {
                    this.hp = BigTank.HIGHEST_HP ;
                }
            }
        } else {
            if ( partIdx == 1) {
                if (this.parts[2].hp<=0&&this.parts[3].hp<=0&&this.parts[4].hp<=0){
                    this.parts[partIdx].hp = 0 ;
                }else{
                    return ;
                }
            }
            this.parts[partIdx].hp = 0 ;
        }
    }
    draw(){
        if (this.parts[1].hp != 0){
            let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
            let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "bigTank", x, y, CELL_SIZE*6, CELL_SIZE*6, 180 ) ;
        }
        if (this.parts[2].hp != 0){
            let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
            let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "light2", x, y, CELL_SIZE*2, CELL_SIZE*2, 0 ) ;
        }
        if (this.parts[3].hp != 0){
            let x = ((this.col-4)*CELL_SIZE+1) + CELL_SIZE/2 ;
            let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "Missile2", x, y, CELL_SIZE*2, CELL_SIZE*2, 0 ) ;
        }
        if (this.parts[4].hp != 0){
            let x = ((this.col+4)*CELL_SIZE+1) + CELL_SIZE/2 ;
            let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "Missile2", x, y, CELL_SIZE*2, CELL_SIZE*2, 0 ) ;
        }
        if (this.parts[1].hp < 1){
            let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
            let y = ((this.row-1)*CELL_SIZE+1) + CELL_SIZE/2 ;
            drawImg( "bigTank3", x, y, CELL_SIZE*5, CELL_SIZE*5, 180 ) ;
            this.drawHp() ;
        }
    // this.autoDraw() ;
    }

    drawHp(){
        ctx.fillStyle = `rgb(255,0,0)` ;
        let l = 0 ; 
        let k = Math.floor(Math.sqrt(this.hp)) ;
        let p = this.hp-k*k ;
        for( let j=0; j<k; j++ ) {
            l++ ; 
            for( let i=0; i<k; i++ ) {
                ctx.fillRect( (this.col-2)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
            }
        }
        for( let j=0; j<10; j++ ) {
            l++ ;
            for( let i=0; i<k; i++ ) {
                if ( p == 0 ){
                    return ; ;
                }
                ctx.fillRect( (this.col-2)*CELL_SIZE-(l*CELL_SIZE/4.5), ((this.row+1)*CELL_SIZE)-(CELL_SIZE*5/6)*(CELL_SIZE/70*i), CELL_SIZE/4, CELL_SIZE/5 ) ;
                p-- ;
            }
        }
    }

    process(){
        let wait = 0 ;
        if (this.hp>BigTank.ONETHIRD_HP){
            wait = 2000 ;
        }else{
            wait = 800 ;
        }
        if ( Date.now() - this.lastFireTS > wait ) {
            this.lastFireTS = Date.now() ;
            if ( this.parts[3].hp > 0 ) {
                new Missile(this.row+1,this.col+this.parts[3].coords[0].col,0) ;
            }
            if ( this.parts[4].hp > 0 ) {
                new Missile(this.row+1,this.col+this.parts[4].coords[0].col,0) ;
            }
            if (this.parts[0].hp > 0 ){
                if (this.parts[1].hp <= 0){
                    let arms = Math.floor(Math.random()*8) ;
                    if (arms == 0){
                        for (let i=0;i<11;i++){
                            new Missile(this.row-1,this.col+5-i,0,0);
                        }
                    }
                    if (arms == 1){
                        let e = Math.floor(Math.random()*2)+2 ;
                        for (let i=0;i<e;i++){
                            let enemyTank = new EnemyTank () ;
                            enemyTank.row = this.row ;
                            enemyTank.col = this.col ;
                        }
                        let p = Math.floor(Math.random()*2)+2 ; 
                        for (let i=0;i<p;i++){
                            let people = new ShieldPeople () ;
                            people.row = this.row ;
                            people.col = this.col ;
                        }
                        let o = Math.floor(Math.random()*1)+2 ; 
                        for (let i=0;i<o;i++){
                            let laserLightTank = new LaserLightTank () ;
                            laserLightTank.row = this.row ;
                            laserLightTank.col = this.col ;
                        }
                    }
                    if (arms == 2){
                        for (let j=0;j<1;j++){
                            for (let i=0;i<9;i++){
                                new LaserLight(this.row-1+j,this.col+3-i,0,0);
                            }
                        }
                    }
                    if (arms == 3||arms == 4||arms == 5||arms == 6){
                        for (let i=0;i<4;i++){
                            new Light(this.row-1,this.col,0,0);
                        }
                    }
                    if (arms == 7){
                        new BlackHole(this.row-1,this.col);
                    }
                }
            }
        }
        if ( Date.now() - this.lastFireTS2 > 1 ) {
            this.lastFireTS2 = Date.now() ;
            if ( this.parts[2].hp > 0 ) {
                new LaserLight(this.row+1,this.col,0);
            }
        }
        ctx.fillStyle = `rgb(255,0,0)` ;
        ctx.font = `${CELL_SIZE/4*3}px Arial`;
        ctx.textAlign = "center" ;
        ctx.fillText("魔王血量:",CELL_SIZE/2*4,CELL_SIZE*2/3);
        bigTankCount = 0 ;
        for ( let i=0;i<EnemyTank.objs.length;i++){
            if ( EnemyTank.objs[i] instanceof BigTank ){
                if (EnemyTank.objs[i].hp>BigTank.ONETHIRD_HP){
                    ctx.fillStyle = `rgb(30,85,30)` ;
                    ctx.fillRect( CELL_SIZE*5 , CELL_SIZE*bigTankCount/2 , BigTank.HIGHEST_HP*this.drawCellHp , CELL_SIZE/5*3 ) ;
                    ctx.fillStyle = `rgb(124,252,0)` ;
                    ctx.fillRect( CELL_SIZE*5 , CELL_SIZE*bigTankCount/2 , EnemyTank.objs[i].hp*this.drawCellHp , CELL_SIZE/5*3 ) ;
                }else{
                    ctx.fillStyle = `rgb(128,0,128)` ;
                    ctx.fillRect( CELL_SIZE*5 , CELL_SIZE*bigTankCount/2 , BigTank.HIGHEST_HP*this.drawCellHp , CELL_SIZE/5*3 ) ;
                    ctx.fillStyle = `rgb(255,0,255)` ;
                    ctx.fillRect( CELL_SIZE*5 , CELL_SIZE*bigTankCount/2 , EnemyTank.objs[i].hp*this.drawCellHp , CELL_SIZE/5*3 ) ;
                }
                bigTankCount++ ;
            }
        }
        
        this.move() ;
        this.draw() ;
    }
}
class BabyTank extends EnemyTank {
    hp=2;
    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "babyTankImg", x, y, CELL_SIZE*2, CELL_SIZE*2, 0 ) ;
        this.drawHp() ;
    }

    process(){
        if ( Math.floor(Math.random()*100)<=0 ) {
            let enemyTank = new EnemyTank () ;
            enemyTank.row = this.row ;
            enemyTank.col = this.col ;
        }
        if ( Math.floor(Math.random()*100)<=0 ) {
            let people = new ShieldPeople () ;
            people.row = this.row ;
            people.col = this.col ;
        }

        this.move() ;
        this.draw() ;
    }

}

