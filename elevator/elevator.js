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
        draw() ;
        //openEvent(this.elevatorId) ;
        CELL_SIZE = Math.floor(340/TOTAL_FLOORS)+1 ;
        ctx.beginPath() ;
        ctx.lineWidth = 2 ;
        ctx.fillStyle = 'black';
        ctx.fillRect( 0, 380, 800, 200 ) ;
        for (let j=0;j<TOTAL_FLOORS+1;j++){
            ctx.moveTo(0,380-(j*CELL_SIZE) );
            ctx.lineTo(800,380-(j*CELL_SIZE) );    
        }
        ctx.moveTo(720,0 );
        ctx.lineTo(720,380 );  
        ctx.moveTo(720+CELL_SIZE,0 );
        ctx.lineTo(720+CELL_SIZE,380 );  
        ctx.stroke();
        ctx.fillStyle = `rgb(0,0,0)` ;
        let n = 380-((this.elevatorPos+1)*CELL_SIZE) ;
        ctx.closePath();
        if (this.tasks.length == 0){
            this.state = STATE_STOP ;
            ctx.fillRect( 720, n, CELL_SIZE, CELL_SIZE ) ;
            return ;
        }
        let m = 0 ;
        for (let i=0;i<this.eventHandler.peoples.length;i++){
            if (this.eventHandler.peoples[i].state == PeopleState.ENTERED || this.eventHandler.peoples[i].state == PeopleState.ASSIGNED){
                m++ ;
            }
        }
        if (this.state == STATE_UP){
            this.elevatorPos++ ;
        }
        if (this.state == STATE_DOWN){
            this.elevatorPos-- ;
        }   
        ctx.beginPath() ;
        ctx.fillStyle = `rgb(255, 0, 0)` ;
        ctx.font = `${CELL_SIZE}px Arial`;
        ctx.textAlign = "center" ;
        ctx.fillText(m,750,n+CELL_SIZE );
        ctx.fillRect( 720, n, CELL_SIZE, CELL_SIZE ) ;
        ctx.closePath();
        console.log(this.elevatorPos+1) ;
        for (let i=0;i<this.tasks.length;i++){
            if (this.elevatorPos == this.tasks[i].toFloor ){
                console.log('叮 ~') ;
                this.eventHandler.arrivedEvent( this.state, this.elevatorPos ) ;
                this.tasks.splice( i--, 1 ) ;
                this.state = STATE_STOP ;
                this.eventHandler.arrivedEvent( this.state, this.elevatorPos ) ;

            }
        }
        ctx.fillStyle = `rgb(255, 0, 0)` ;
        let z = [] ;
        for (let i=0;i<TOTAL_FLOORS;i++){
            z[i] = 0 ;
        }
        for (let i=0;i<this.eventHandler.peoples.length;i++){
            if (this.eventHandler.peoples[i].state == PeopleState.PRESSED){
                z[this.eventHandler.peoples[i].fromFloor-1]++ ;
            }
        } 
        for (let i=0;i<z.length;i++){
            for (let j=0;j<z[i];j++){
                let x = 720-CELL_SIZE+CELL_SIZE/2+1-j*CELL_SIZE ;
                let y = 380-(this.eventHandler.peoples[i].fromFloor+1)*CELL_SIZE+CELL_SIZE/2+1 ;
                drawImg( "people", x, y, CELL_SIZE, CELL_SIZE, 0 ) ;
            }
        }
        ctx.fillStyle = `rgb(255, 0, 0)` ;
        let k = [] ;
        for (let i=0;i<TOTAL_FLOORS;i++){
            k[i] = 0 ;
        }
        for (let i=0;i<this.eventHandler.peoples.length;i++){
            if (this.eventHandler.peoples[i].state == PeopleState.EXITED){
                k[this.eventHandler.peoples[i].toFloor-1]++ ;
                this.eventHandler.peoples[i].nextState() ;
            }
        } 
        for (let i=0;i<k.length;i++){
            for (let j=0;j<k[i];j++){
                let x = 780 ;
                let y = 380-(this.eventHandler.peoples[i].toFloor+1)*CELL_SIZE+CELL_SIZE/2+1 ;
                drawImg( "people", x, y, CELL_SIZE, CELL_SIZE, 0 ) ;
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

