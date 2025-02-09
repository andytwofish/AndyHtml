class OurBullet extends Entity {
    static objs = [] ; 
    createFrom = 0 ;
    hp=1;
    moveDistance = TOTAL_ROWS ;
    constructor( row, col, rotation ) {
        super( row, col, rotation ) ;
        this.moveDirection = rotation ;
        OurBullet.objs.push(this) ;
    }
    static process() {
        for( let i=0; i<OurBullet.objs.length; i++ ) {
            if ( OurBullet.objs[i].hp <= 0 ) {
                OurBullet.objs.splice( i--, 1 ) ;
            } else {
                OurBullet.objs[i].process() ;
            }
        }
    }

    init() {
        this.spaceBoundary.top = 0;
        this.spaceBoundary.bottom = TOTAL_ROWS-1;
        this.spaceBoundary.left = 0;
        this.spaceBoundary.right = TOTAL_COLS-1;

        let part0 = new Part() ;
        part0.add(0,0) ;
        part0.fillStyle = "rgb(200,0,0)" ;

        this.parts = [] ;
        this.parts.push( part0 ) ;
    }
    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        drawImg( "lightImg", x, y, CELL_SIZE, CELL_SIZE, this.rotation ) ;
    }
    checkAfterMoved() {
        for( let i=0; i<EnemyTank.objs.length; i++ ) {
            let entity = EnemyTank.objs[i]  ;
            if ( entity.attackCheck( this ) ) {
                this.hp-- ;
            }
        }
        for( let i=0; i<EnemyBullet.objs.length; i++ ) {
            let entity = EnemyBullet.objs[i]  ;
            if ( entity instanceof Missile ) {
                if ( entity.attackCheck( this ) ) {
                    this.hp-- ;
                }
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
            if ( !isMove ) {
                this.hp = 0 ;
            } else {
                this.checkAfterMoved() ;
            }
        } else {
            this.hp = 0 ;
        }

    }

}
class OurBomb extends OurBullet {
    rotation = 0 ;
    createFrom = 0 ;
    hp=999;
    bombLevel = 0 ;
    moveDistance = TOTAL_ROWS ;
    moveDirection=0;
    constructor( row, col, bombLevel ) {
        super( row, col, 0 ) ;
        this.bombLevel = bombLevel ;
        this.init2();
    }
    init() {}
    init2() {
        this.spaceBoundary.top = 0;
        this.spaceBoundary.bottom = TOTAL_ROWS-1;
        this.spaceBoundary.left = 0;
        this.spaceBoundary.right = TOTAL_COLS-1;

        this.parts = [] ;

        let part = new Part() ;
        part.fillStyle = "rgb(200,0,0)" ;
        part.hp=this.bombLevel*5;
        for( let i=0; i<this.bombLevel; i++ ) {
            for( let j=-i; j<=i; j++) {
                part.add( i-this.bombLevel, j ) ;
            }
        }
        for( let i=0; i<this.bombLevel-1; i++ ) {
            for( let j=-i; j<=i; j++) {
                part.add( this.bombLevel-2-i, j ) ;
            }
        }
        this.parts.push(part) ;
    }
    draw(){
        let x = (this.col*CELL_SIZE+1) + CELL_SIZE/2 ;
        let y = (this.row*CELL_SIZE+1) + CELL_SIZE/2 ;
        this.rotation+=20 ;
        drawImg( "lightImg", x, y, CELL_SIZE*this.bombLevel*2, CELL_SIZE*this.bombLevel*2, this.rotation ) ;
    }


}
class MyLight extends OurBullet{
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
        for( let i=0; i< EnemyTank.objs.length ; i++ ) {
            let entity = EnemyTank.objs[i] ;
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
            this.coord.row-=1 ;
            if ( this.coord.row < TOTAL_ROWS-(TOTAL_ROWS*2) ) {
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