class EnemyBullet extends Entity {
    static objs = [] ;
    createFrom = 0 ;
    moveDistance = 100 ;
    constructor( row, col, rotation ) {
        super( row, col, rotation ) ;
        this.moveDirection = rotation ;
        EnemyBullet.objs.push(this) ;
    }

    static process() {
        for( let i=0; i<EnemyBullet.objs.length; i++ ) {
            if ( EnemyBullet.objs[i].hp <= 0 ) {
                EnemyBullet.objs.splice( i--, 1 ) ;
            } else {
                EnemyBullet.objs[i].process() ;
            }
        }
    }

    init() {
        let part0 = new Part() ;
        part0.add(0,0) ;
        part0.fillStyle = "rgb(200,0,0)" ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
    }
    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "M.bulletImg", x, y, CELL_SIZE, CELL_SIZE, this.rotation ) ;
    }

    checkAfterMoved() {
        for( let i=0; i< MyTank.objs.length ; i++ ) {
            let entity = MyTank.objs[i] ;
            if ( entity.attackCheck( this ) ) {
                this.hp-- ;
            }
        }
    }

    move() {
        if ( this.moveDistance-- > 0 )  {
            let isMove = false ;
            switch( this.moveDirection ) {
                case 0:
                    isMove = this.moveOutBoundary( this.row-1, this.col ) ;
                    break;
                case 90:
                    isMove = this.moveOutBoundary( this.row, this.col+1 ) ;
                    break;
                case 180:
                    isMove = this.moveOutBoundary( this.row+1, this.col ) ;
                    break;
                case 270:
                    isMove = this.moveOutBoundary( this.row, this.col-1 ) ;
                    break;
            }
            if ( isMove ) {
                this.checkAfterMoved() ;
            } else {
                this.hp = 0 ;
            }

        } else {
            this.hp = 0 ;
        }

    }

}

class Missile extends EnemyBullet{
    direction = 0 ;
    lastMovedTS = 0 ;
    init() {
        let part0 = new Part() ;
        part0.add(0,0) ;
        part0.fillStyle = "rgb(200,0,0)" ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
        this.target = this.findTarget() ;
    }

    findTarget() {
        if ( MyTank.objs.length <= 0 ) {
            return null;
        }
        return MyTank.objs[Math.floor(Math.random()*MyTank.objs.length)] ;
    }

    attackedPart( fromEntity, partIdx) {
        if ( fromEntity instanceof OurBullet ) {
            this.hp = 0 ;
        }
    }

    process(){
        if ( Date.now() - this.lastMovedTS < 100 ) {
            this.draw() ;
            return ;
        }
        this.lastMovedTS = Date.now() ;
        if ( this.target.hp != null && this.target.hp <= 0 ) {
            this.target = this.findTarget() ;
            if ( this.target == null ) {
                return ;
            }
        }
        if (Math.floor(Math.random()*2) == 0){
            if (this.row>this.target.row){
                this.moveDirection=0;
                this.direction=0;
            }else{
                if(this.row<this.target.row){
                    this.moveDirection=180;
                    this.direction=180;
                }
            }
        }else{
            if (this.col>this.target.col){
                    this.moveDirection=270;
                    this.direction=270;
            }else{
                if(this.col<this.target.col){
                    this.moveDirection=90;
                    this.direction=90;
                }                                          
            }
        }
        this.move() ;        
        this.draw() ;  
    }
    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "diode", x, y, CELL_SIZE*3/2, CELL_SIZE*3/2, this.direction ) ;
    }
}
class LaserLight extends EnemyBullet{
    moveDistance = 100 ;
    moveDirection = 0 ;
    init() {
        let part0 = new Part() ;
        part0.add(0,0).add(-1,0).add(-2,0).add(-3,0).add(-4,0).add(-5,0).add(-6,0) ;
        part0.fillStyle = "rgb(200,0,0)" ;
        part0.hp = 999 ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
    }


   move() {
        if ( this.moveDistance-- > 0 )  {
            let isMove = this.moveOutBoundary( this.row+6, this.col ) ;
            if ( isMove ) {
                this.checkAfterMoved() ;
            } else {
                this.hp = 0 ;
            }

        } else {
            this.hp = 0 ;
        }

    }

    draw(){
        this.autoDraw() ;
    }
}
class Light extends EnemyBullet {
    createFrom = 0 ;
    lightdirection = 0 ;
    moveCount = 0 ;
    moveDistance = 100 ;
    color = 0 ;
    coord = new Coord(0,0) ;
    constructor( row, col, rotation, color ) {
        super( row, col, rotation) ;
        this.moveDirection = rotation ;
        this.color = color ;
    }

    init() {
        let part0 = new Part() ;
        part0.add(0,0) ;
        part0.fillStyle = "rgb(200,0,0)" ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
    }
    draw(){
        this.autoDraw() ;
    }

    checkAfterMoved() {
        for( let i=0; i< MyTank.objs.length ; i++ ) {
            let entity = MyTank.objs[i] ;
            if ( entity.attackCheck( this ) ) {
                this.hp-- ;
            }
        }
    }

    move() {
        for(let i=0;i<4;i++){
            if (this.moveCount<=0 ){
                this.lightdirection = Math.floor(Math.random()*3)-1 ;
                this.moveCount = Math.floor(Math.random()*5)+1 ;
            }
            this.moveCount-=1 ;
            this.coord.row+=1 ;
            if ( this.coord.row > TOTAL_ROWS ) {
                this.hp = 0 ;
                return ;
            }
            let part = new Part() ;

            part.add( this.coord.row, this.coord.col ) ;
            let j=Math.floor(Math.random()*5) ;
            if ( this.color == 0 ){
                part.fillStyle = "rgb(255,255,0)"
            }else{
                if (j==0){
                    part.fillStyle = "rgb(0,191,255)" ;
                }
                if (j==1){
                    part.fillStyle = "rgb(255,255,0)" ;
                }
                if (j==2){
                    part.fillStyle = "rgb(255,255,0)" ;
                }
                if (j==3){
                    part.fillStyle = "rgb(255,255,0)" ;
                }
                if (j==4){
                    part.fillStyle = "rgb(0,0,128)" ;
                }
            }
            this.coord.col+=this.lightdirection ;
            part.add( this.coord.row, this.coord.col ) ;

            this.parts.push( part ) ;
        }
        this.checkAfterMoved() ;
    }

}