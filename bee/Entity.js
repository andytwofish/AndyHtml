console.log("load Entity.js");
class Coord {
    row=0;
    col=0;
    constructor( row, col ) {
        this.row = row ;
        this.col = col ;
    }
}

class Boundary {
    top = 0 ;
    bottom = 0 ;
    left = 0 ;
    right = 0 ;
}

class Part {
    coords = [] ;
    hp = 1 ;
    fillStyle = `rgb(100,100,100)` ;
    boundary = new Boundary() ;

    updateBoundary( coord ) {
        if ( coord.col > 0 && coord.col > this.boundary.right ) {
            this.boundary.right = coord.col ;
        }
        if ( coord.col < 0 && coord.col < this.boundary.left ) {
            this.boundary.left = coord.col ;
        }
        if ( coord.row > 0 && coord.row > this.boundary.bottom ) {
            this.boundary.bottom = coord.row ;
        }
        if ( coord.row < 0 && coord.row < this.boundary.top ) {
            this.boundary.top = coord.row ;
        }
    }

    add(row,col) {
        let coord = new Coord() ;
        coord.row = row ;
        coord.col = col ;
        this.coords.push( coord ) ;
        this.updateBoundary( coord ) ;
        return this ;
    }
}

class Entity {
    static objs = [] ;
    static DirectionMap = [0, 90, 180, 270] ;
    hp = 1 ;
    spaceBoundary = new Boundary() ;
    moveDistance = 0 ;
    moveDelayTime = 100 ;
    moveDirection = 0 ;


    constructor( row, col, rotation ) {
        this.rotation = rotation ;
        this.row = row ;
        this.col = col ;
        this.spaceBoundary.top = 0;
        this.spaceBoundary.bottom = TOTAL_ROWS-1;
        this.spaceBoundary.left = 0;
        this.spaceBoundary.right = TOTAL_COLS-1;
        this.init() ;
        Entity.objs.push( this ) ;
    }

    moveCheck( row, col ) {
        let entityBoundary = this.findEntityBoundary() ;
        if ( row+entityBoundary.top < this.spaceBoundary.top || row+entityBoundary.bottom > this.spaceBoundary.bottom ) {
            return false ;
        }
        if ( col+entityBoundary.left < this.spaceBoundary.left || col+entityBoundary.right > this.spaceBoundary.right ) {
            return false ;
        }
        return true ;
    }

    moveOutCheck( row, col ) {
        let entityBoundary = this.findEntityBoundary() ;
        if ( row+entityBoundary.top > this.spaceBoundary.bottom+1 || row+entityBoundary.bottom < this.spaceBoundary.top-1 ) {
            return false ;
        }
        if ( col+entityBoundary.left > this.spaceBoundary.right+1 || col+entityBoundary.right < this.spaceBoundary.left-1 ) {
            return false ;
        }
        return true ;
    }


    moveOutBoundary( row, col ) {
        if ( this.moveOutCheck(row, col ) ) {
            this.row = row ;
            this.col = col ;
            return true ;
        }
        return false ;
    }

    moveInBoundary( row, col ) {
        if ( this.moveCheck(row, col ) ) {
            this.row = row ;
            this.col = col ;
            return true ;
        }
        return false ;
    }

    getRandomLocation() {
        let coord = new Coord() ;
        while( true ) {
            coord.row = Math.floor(Math.random()* (this.spaceBoundary.bottom-this.spaceBoundary.top) )+this.spaceBoundary.top ;  
            coord.col = Math.floor(Math.random()* (this.spaceBoundary.right-this.spaceBoundary.left) )+this.spaceBoundary.left ; 
            if ( this.moveCheck( coord.row, coord.col ) ) {
                break;
            }
        }
        return coord ;
    }

    findEntityBoundary() {
        let boundary = new Boundary() ;
        for( let partIdx=0; partIdx<this.parts.length; partIdx++ ) {
            if ( this.parts[partIdx].hp <= 0 ) {
                continue ;
            }
            let partBoundary = this.parts[partIdx].boundary ;
            if ( partBoundary.right > boundary.right ) {
                boundary.right = partBoundary.right ;
            }
            if ( partBoundary.left < boundary.left ) {
                boundary.left = partBoundary.left ;
            }
            if ( partBoundary.top < boundary.top ) {
                boundary.top = partBoundary.top ;
            }
            if ( partBoundary.bottom > boundary.bottom ) {
                boundary.bottom = partBoundary.bottom ;
            }
        }
        return boundary ;
    }

    draw() {
        this.autoDraw() ;
    }

    autoDraw(){
        for( let partIdx=0; partIdx<this.parts.length; partIdx++ ) {
            if ( this.parts[partIdx].hp <= 0 ) {
                continue ;
            }
            ctx.fillStyle = this.parts[partIdx].fillStyle ;
            for ( let i=0; i<this.parts[partIdx].coords.length; i++ ) {
                let coord = this.parts[partIdx].coords[i] ;
                ctx.fillRect( (this.col+coord.col)*CELL_SIZE+1, (this.row+coord.row)*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2 ) ;
            }
        }
    }

    attackedPart( fromEntity, partIdx) {
        this.hp--;
    }

    _attackPartCheck( fromEntity, fromPart, toEntity, toPart ) {
        //初步比較
        if ( toPart.boundary.right < fromPart.boundary.left ) {
            return false ;
        }
        if ( toPart.boundary.top > fromPart.boundary.bottom ) {
            return false ;
        }
        if ( toPart.boundary.left > fromPart.boundary.right ) {
            return false ;
        }
        if ( toPart.boundary.bottom < fromPart.boundary.top ) {
            return false ;
        }

        //細部每個cell比較
        for ( let i=0; i<fromPart.coords.length; i++ ) {
            let fromCoord = fromPart.coords[i] ;
            for ( let j=0; j<toPart.coords.length; j++ ) {
                let toCoord = toPart.coords[j] ;
                if ( fromEntity.row+fromCoord.row == this.row+toCoord.row 
                    && fromEntity.col+fromCoord.col == this.col+toCoord.col ) {
                    return true ;
                }
            }
        }
        return false ;
    }

    attackCheck( fromEntity ) {
        let toEntity = this ;
        let fromEntityBoundary = fromEntity.findEntityBoundary() ;
        let toEntityBoundary = toEntity.findEntityBoundary() ;
        let ret = false ;

        for( let i=0; i<toEntity.parts.length; i++ ) {
            if ( toEntity.parts[i].hp <= 0 ) {
                continue ;
            }
            for( let j=0; j<fromEntity.parts.length; j++) {
                if ( fromEntity.parts[j].hp <= 0 ) {
                    continue ;
                }
                if ( this._attackPartCheck(fromEntity, fromEntity.parts[j], toEntity, toEntity.parts[i] ) ) {
                    this.attackedPart( fromEntity, i ) ;
                    ret = true ;
                }
            }
        }
        return ret ;
    }

    process(){
        this.move() ;
        this.draw() ;
    }
}
