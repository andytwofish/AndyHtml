class PeopleState {
    static INIT=0;
    static PRESSED=1;
    static ENTERED=2;
    static ASSIGNED=3;
    static EXITED=4;
    static END=5;
    static END2=6;

    static getPeopleStateName(stateNumber) {
        for (const [key, value] of Object.entries(PeopleState)) {
            if (value === stateNumber) {
                return key;
            }
        }
        return null; // or any other fallback value
    }

} 

class People {
    static numberOfPeople = 0 ;
    id = People.numberOfPeople++ ;
    fromFloor = 0 ;
    toFloor = 0 ;
    state = PeopleState.INIT ;
    constructor( fromFloor, toFloor ) {
        this.fromFloor = fromFloor ;
        this.toFloor = toFloor ;
        if ( toFloor > fromFloor ) {
            this.direction = 1 ;
        } else {
            this.direction = -1 ;
        }
    }
    nextState() {
        if ( this.state != PeopleState.END2 ) {
            this.state++ ;
        }
        switch( this.state ) {
            case PeopleState.INIT:
                break;
            case PeopleState.PRESSED:
                break;
            case PeopleState.ENTERED:
                break;
            case PeopleState.ASSIGNED:
                break;
            case PeopleState.EXITED:
                break;
        }
        //console.log( "(" + this.id + ") " + PeopleState.getPeopleStateName(this.state) ) ;
    }
}

class Test1 {
    peoples = [] ;
    index=-1;
    beginTime = 0 ;
    elevatorMoveTime = 400 ;
    lastMoveTime = 0 ;
    static TOTAL_PEOPLES = 30 ;
    elevator = new Elevator( TOTAL_FLOORS, this ) ;
    constructor(){
        for( let i=0; i<Test1.TOTAL_PEOPLES; i++ ) {
            let people = null ;
            do {
                people = new People( Math.floor(Math.random()*TOTAL_FLOORS), Math.floor(Math.random()*TOTAL_FLOORS) ) ;
            } while ( people.fromFloor === people.toFloor ) ;
            this.peoples.push( people ) ;
        }
    }index
    start() {
        this.beginTime = Date.now() ;
        this.index=0;
    }
    arrivedEvent(direction, floor) {
        for( let i=0; i<Test1.TOTAL_PEOPLES; i++ ) {
            let people = this.peoples[i] ;
            if ( people.state === PeopleState.PRESSED && people.fromFloor === floor ) {
                if ( direction == 0 || direction === people.direction ) {
                    console.log( "(" + people.id + ") 在" + (people.fromFloor+1) + "樓進了電梯" ) ;
                    people.nextState();
                    console.log( "(" + people.id + ") 按下了" + (people.toFloor+1) + "樓" ) ;
                    this.elevator.goTo( people.toFloor ) ;
                    people.nextState() ;
                }
            }
            if ( people.state === PeopleState.ASSIGNED && people.toFloor === floor ) {
                console.log( "(" + people.id + ") 在" + (people.toFloor+1) + "樓離開電梯" ) ;
                people.nextState() ;
            }
        }
    }

    next() {
        if ( Date.now() - this.lastMoveTime > this.elevatorMoveTime ) {
            this.lastMoveTime = Date.now() ;
            this.elevator.next();
        }
        if ( this.index >= this.peoples.length ) {
            return ;
        }
        if ( Date.now()-this.beginTime >= this.index*400 ) {
            let people = this.peoples[this.index] ;
            if ( people.state == PeopleState.INIT ) {
                if ( people.direction == 1 ) {
                    console.log( "(" + people.id + ") 在" + (people.fromFloor+1) + "樓按下了往上" ) ;
                    this.elevator.up( people.fromFloor ) ;
                } else {
                    console.log( "(" + people.id + ") 在" + (people.fromFloor+1) + "樓按下了往下" ) ;
                    this.elevator.down( people.fromFloor ) ;
                }
                people.nextState() ;
            }
            this.index++;
        }
    }
}

