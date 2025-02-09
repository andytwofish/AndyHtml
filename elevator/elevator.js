class Task {
    toFloor = 0 ;
    condition = CONDITION_ANY ;
}

class Elevator {
    numberOfFloors = 0 ;
    whereIsElevator = 0 ;
    tasks = [] ;
    constructor(numberOfFloors){
        this.numberOfFloors = numberOfFloors ;
    }
    next() {
        console.log(this.tasks) ;
        //openEvent(elevatorId) ;

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

