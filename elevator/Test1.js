class UserKey {
    toFloor = 0 ;
    condition = CONDITION_ANY ;
    constructor( toFloor, condition ){
        this.toFloor = toFloor ;
        this.condition = condition ;
    }
}

class Test1 {
    tasks = [] ;
    index=-1;
    beginTime = 0 ;
    elevatorMoveTime = 800 ;
    lastMoveTime = 0 ;
    elevator = new Elevator(10) ;
    constructor(){
        this.addTask(2, 1, CONDITION_UP ) ;
        this.addTask(2.2, 5, CONDITION_ANY ) ;
        this.addTask(2.3, 8, CONDITION_ANY ) ;
        this.addTask(3, 3, CONDITION_DOWN ) ;
        this.addTask(3.2, 1, CONDITION_ANY ) ;
    }
    addTask( seconds, toFloor, condition ) {
        let obj = new Object() ;
        obj.ms = seconds*1000 ;
        obj.userKey = new UserKey( toFloor, condition ) ;
        this.tasks.push(obj) ;
    }
    start() {
        //console.log(this.tasks) ;
        this.beginTime = Date.now() ;
        this.index=0;
    }
    next() {
        if ( Date.now() - this.lastMoveTime > this.elevatorMoveTime ) {
            this.lastMoveTime = Date.now() ;
            this.elevator.next();
        }
        if ( this.index == -1 ) {
            return ;
        }
        if ( Date.now()-this.beginTime >= this.tasks[this.index].ms ) {
            let userKey = this.tasks[this.index].userKey ;
            console.log(userKey) ;
            switch( userKey.condition ) {
                case CONDITION_ANY:
                    this.elevator.goTo( userKey.toFloor ) ;
                    break;
                case CONDITION_UP:
                    this.elevator.up( userKey.toFloor ) ;
                    break;
                case CONDITION_DOWN:
                    this.elevator.down( userKey.toFloor ) ;
                    break;
            }
            if ( ++this.index >= this.tasks.length ) {
                this.index = -1 ;
                return ;
            }
            this.next() ;
        }
    }
}

