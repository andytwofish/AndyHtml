class Task {
    toFloor = 0 ;
    condition = CONDITION_ANY ;
}
const STATE_STOP = 0 ;
const STATE_UP = 1 ;
const STATE_DOWN = -1 ; 
class Elevator {
    numberOfFloors = 0 ;
    elevatorPos = 0 ; 
    state = STATE_STOP ;
    
    
    
    tasks = [] ;
    constructor(numberOfFloors, eventHandler ){
        this.numberOfFloors = numberOfFloors ;
        this.eventHandler = eventHandler ;
    }
    next() {
        //console.log(this.tasks) ;
        //openEvent(this.elevatorId) ;
        if (this.tasks.length == 0){
            this.state = STATE_STOP ;
            return ;
        }
        if (this.state == STATE_UP){
            this.elevatorPos++ ;
        }
        if (this.state == STATE_DOWN){
            this.elevatorPos-- ;
        }   
        console.log(this.elevatorPos+1) ;
        for (let i=0;i<this.tasks.length;i++){
            if (this.elevatorPos == this.tasks[i].toFloor ){
                console.log('叮~') ;
                this.eventHandler.arrivedEvent( this.state, this.elevatorPos ) ;
                this.tasks.splice( i--, 1 ) ;
                this.state = STATE_STOP ;
                this.eventHandler.arrivedEvent( this.state, this.elevatorPos ) ;

            }
        }
        if (this.tasks.length == 0){
            this.state = STATE_STOP ;
            return ;
        }
        if (this.state == STATE_STOP ){
            if (this.tasks[0].toFloor>this.elevatorPos){
                this.state = STATE_UP ;    
            }else{
                this.state = STATE_DOWN ;   
            }
        }
    }
    up(fromFloor) {
        let task = new Task() ;
        task.condition = CONDITION_UP ;
        task.toFloor = fromFloor ;
        this.tasks.push(task) ;
    }
    down(fromFloor) {
        let task = new Task() ;
        task.condition = CONDITION_DOWN ;
        task.toFloor = fromFloor ;
        this.tasks.push(task) ;
    }
    goTo(toFloor) {
        let task = new Task() ;
        task.condition = CONDITION_ANY ;
        task.toFloor = toFloor ;
        this.tasks.push(task) ;
    }
}

