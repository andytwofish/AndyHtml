class Task {
    toFloor = 0 ;
    condition = CONDITION_ANY ;
}
const STATE_STOP = 0 ;
const STATE_UP = 1 ;
const STATE_DOWN = 2 ; 
class Elevator {
    numberOfFloors = 0 ;
    elevatorPos = 0 ; 
    state = STATE_STOP ;
    
    
    
    tasks = [] ;
    constructor(numberOfFloors){
        this.numberOfFloors = numberOfFloors ;
    }
    next() {
        //console.log(this.tasks) ;
        //openEvent(this.elevatorId) ;
        console.log(this.elevatorPos+1) ;
        if (this.tasks.length == 0){
            return ;
        }
        if (this.state == STATE_STOP ){
            if (this.tasks[0].toFloor>this.elevatorPos){
                this.state = STATE_UP ;    
            }else{
                this.state = STATE_DOWN ;   
            }
            
        }
        if (this.state == STATE_UP){
            this.elevatorPos++ ;
        }
        if (this.state == STATE_DOWN){
            this.elevatorPos-- ;
        }       
        for (let i=0;i<this.tasks.length;i++){
            if (this.elevatorPos == this.tasks[i].toFloor ){
                this.tasks.splice( i--, 1 ) ;
            }
        }
        for (let i=0;i<this.tasks.length;i++){
            if (this.state == STATE_UP){
                if (this.elevatorPos < this.tasks[i].toFloor ){
                    return ;
                }
            }
            if (this.state == STATE_DOWN){
                if (this.elevatorPos > this.tasks[i].toFloor ){
                    return ;
                }
            }
        }
        if (this.state == STATE_UP){
            this.state = STATE_DOWN ;
        }
        if (this.state == STATE_DOWN){
            this.state = STATE_UP ;
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

