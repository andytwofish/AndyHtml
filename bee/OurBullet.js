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
        drawImg( "M.bulletImg", x, y, CELL_SIZE, CELL_SIZE, this.rotation ) ;
    }
    checkAfterMoved() {
        for( let i=0; i<EnemyTank.objs.length; i++ ) {
            let entity = EnemyTank.objs[i]  ;
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
class OurBomb extends Entity {
    createFrom = 0 ;
    hp=1;
    bombLevel = 0 ;
    moveDistance = TOTAL_ROWS ;
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

        let part = null ;

        switch ( this.bombLevel ) {
            case 8:
            case 7:
            case 6:            
            case 5:
            case 4:
            case 3:
                part = new Part() ;
                part.add(0,-3).add(0,3).add(1,-2).add(1,2).add(-1,-2).add(-1,2).add(-2,-1).add(-2,1).add(2,-1).add(2,1).add(3,0).add(-3,0) ;
                part.fillStyle = "rgb(200,0,0)" ;
                part.hp = 999 ;
                this.parts.push( part ) ;
            case 2:
                part = new Part() ;
                part.add(0,-2).add(0,2).add(1,-1).add(1,1).add(-1,-1).add(-1,1).add(-2,0).add(2,0) ;
                part.fillStyle = "rgb(200,0,0)" ;
                part.hp = 999 ;
                this.parts.push( part ) ;
            case 1:
                part = new Part() ;
                part.add(0,-1).add(0,1).add(1,0).add(-1,0) ;
                part.fillStyle = "rgb(200,0,0)" ;
                part.hp = 999 ;
                this.parts.push( part ) ;
            case 0:
                part = new Part() ;
                part.add(0,0) ;
                part.fillStyle = "rgb(200,0,0)" ;
                part.hp = 999;
                this.parts.push( part ) ;
        }
        console.log( this.bombLevel ) ;
        console.log( this.parts.length ) ;

    }
    draw(){
        this.autoDraw() ;
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
