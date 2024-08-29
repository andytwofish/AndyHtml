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
    run = 64 ;
    direction = 0 ;
    target = target[Math.floor(Math.random()*MyTank.objs.length)] ;
    process(){
        if (this.run-- < 0 ){
            this.hp = 0 ;
            return ;
        }
        if (Math.floor(Math.random()*2) == 0){
            if (this.row>this.target.row){
                this.row-- ;
                this.direction = 0 ;
            }else{
                if(this.row<this.target.row){
                    this.row++ ;
                    this.direction = 180 ;
                }
            }
        }else{
            if (this.col>this.target.col){
                    this.col-- ;        
                    this.direction = 270 ;                           
            }else{
                if(this.col<this.target.col){
                    this.col++ ;
                    this.direction = 90 ;
                }                                          
            }
        }
        
        this.drawBulletCell() ;  
    }
    drawBulletCell(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "diode", x, y, CELL_SIZE*3/2, CELL_SIZE*3/2, this.direction ) ;
    }
}
class LaserLight extends EnemyBullet{
    hp = 7 ;
    process(){
        this.hp-- ;
        if ( this.hp<1 ) {
            return ;
        }
        this.drawBulletCell()          
    }
    drawBulletCell(){
        ctx.fillStyle = `rgb(100,0,0)` ;
        ctx.fillRect( this.col*CELL_SIZE, this.row*CELL_SIZE, CELL_SIZE, CELL_SIZE ) ;
    }
}