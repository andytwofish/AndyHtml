

class EnemyTank extends Entity {
    static objs = [] ;
    lastFireTS = Date.now() ;
    lastMoveTS = Date.now() ;
    moveDelayTime = 100 ;
    stopTime = 1000 ; //移動完停多久
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
    }

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
        super.process() ;
        if ( Date.now() - this.lastFireTS > 1000 ) {
            this.lastFireTS = Date.now() ;
            new EnemyBullet(this.row, this.col, 180) ;
        }

    }
}

class ShieldPeople extends EnemyTank {
    lastShieldTS = 0 ;

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
    }

    attackedPart( fromEntity, partIdx) {
        if ( partIdx == 0) {
            this.hp = 0 ;
            for( let i=1; i<this.parts.length; i++) {
                if ( this.parts[i].hp > 0 ) {
                    this.hp = 1 ;
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
class BigTank extends SuperTank{
    HIGHEST_HP = 4 ;
    hp = this.HIGHEST_HP ;
    lastFireTS = 2000 ;
    lastFireTS2 = 2000 ;
    init() {
        let part0 = new Part() ;
        part0.add(-2,0)
        let part1 = new Part() ;
        part1.add(0,0).add(-1,-1).add(-1,0).add(-1,1).add(0,-1).add(0,1).add(1,-1).add(1,0).add(1,1) ;
        part1.add(-1,-2).add(-1,2).add(-1,-3).add(-1,3).add(-1,-4).add(-1,4).add(1,-2).add(1,2).add(2,-2).add(2,2).add(3,-2).add(3,2).add(4,-1).add(4,1) ;

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
                    this.hp = this.HIGHEST_HP ;
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
    process(){
        if ( Date.now() - this.lastFireTS > 2000 ) {
            this.lastFireTS = Date.now() ;
            if ( this.parts[3].hp > 0 ) {
                new Missile(this.row+1,this.col+this.parts[3].coords[0].col,0) ;
            }
            if ( this.parts[4].hp > 0 ) {
                new Missile(this.row+1,this.col+this.parts[4].coords[0].col,0) ;
            }
            if (this.parts[0].hp > 0 ){
                if (this.parts[1].hp <= 0){
                    new Missile(this.row+1,this.col+this.parts[0].coords[0].col,0) ;
                    for (let i=0;i<MyTank.objs.length*2;i++){
                        new Light(0,Math.floor(Math.random()*TOTAL_COLS),0) ;
                    }
                }
            }
        }
        if ( Date.now() - this.lastFireTS2 > 800 ) {
            this.lastFireTS2 = Date.now() ;
                if ( this.parts[2].hp > 0 ) {
                    new LaserLight(this.row+1,this.col,0);
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

