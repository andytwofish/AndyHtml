class OurBullet extends Entity {
    createFrom = 0 ;
    hp=1;
    moveDistance = TOTAL_ROWS ;
    constructor( row, col, rotation ) {
        super( row, col, rotation ) ;
        this.moveDirection = rotation ;
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
        for( let i=0; i<Entity.objs.length; i++ ) {
            let entity = Entity.objs[i]  ;
            if ( entity instanceof EnemyTank ) {
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
                    isMove = this.moveIfPermitted( this.row-1, this.col ) ;
                    break;
                case 90:
                    isMove = this.moveIfPermitted( this.row, this.col+1 ) ;
                    break;
                case 180:
                    isMove = this.moveIfPermitted( this.row+1, this.col ) ;
                    break;
                case 270:
                    isMove = this.moveIfPermitted( this.row, this.col-1 ) ;
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
