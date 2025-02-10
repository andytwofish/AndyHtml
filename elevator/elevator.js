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
        if (this.state == STATE_UP){
            this.elevatorPos++ ;
        }
        if (this.state == STATE_DOWN){
            this.elevatorPos-- ;
        }   
        console.log(this.elevatorPos+1) ;

        draw() ;
        //openEvent(this.elevatorId) ;
        ctx.beginPath() ;
        ctx.lineWidth = 2 ;
        //ctx.fillStyle = 'black';
        ctx.fillStyle = `rgb(0, 0, 0)` ;
        ctx.fillRect( 0, 380, 800, 200 ) ;
        for (let j=0;j<TOTAL_FLOORS+1;j++){
            ctx.moveTo(0,380-(j*CELL_SIZE) );
            ctx.lineTo(800,380-(j*CELL_SIZE) );    
        }
        ctx.moveTo(720,0 );
        ctx.lineTo(720,380 );  
        ctx.moveTo(720+CELL_SIZE,0 );
        ctx.lineTo(720+CELL_SIZE,380 );  

        let n = 380-CELL_SIZE-((this.elevatorPos)*CELL_SIZE) ;
        if (this.tasks.length == 0){
            this.state = STATE_STOP ;
            ctx.fillRect( 720, n, CELL_SIZE, CELL_SIZE ) ;
            return ;
        }
        ctx.closePath();
        ctx.stroke();

        for (let i=0;i<this.tasks.length;i++){
            if (this.elevatorPos == this.tasks[i].toFloor ){
                console.log('叮 ~') ;
                this.tasks.splice( i--, 1 ) ;
                this.state = STATE_STOP ;
                this.eventHandler.arrivedEvent( this.state, this.elevatorPos ) ;
            }
        }

        let m = 0 ;
        for (let i=0;i<this.eventHandler.peoples.length;i++){
            if (this.eventHandler.peoples[i].state == PeopleState.ENTERED || this.eventHandler.peoples[i].state == PeopleState.ASSIGNED){
                m++ ;
            }
        }
        ctx.beginPath() ;
        ctx.fillStyle = `rgb(0, 0, 0)` ;
        ctx.fillRect( 720, n, CELL_SIZE, CELL_SIZE ) ;
        ctx.fillStyle = `rgb(255, 0, 0)` ;
        ctx.font = `${CELL_SIZE/2}px Arial`;
        ctx.textAlign = "center" ;
        ctx.fillText(m,730,n);
        ctx.closePath();
        ctx.stroke();


        let z = [] ;
        for (let i=0;i<TOTAL_FLOORS;i++){
            z[i] = 0 ;
        }
        for (let i=0;i<this.eventHandler.peoples.length;i++){
            if (this.eventHandler.peoples[i].state == PeopleState.PRESSED){
                z[this.eventHandler.peoples[i].fromFloor]++ ;
            }
        } 

        ctx.beginPath() ;
        ctx.fillStyle = `rgb(255, 0, 0)` ;
        for (let i=0;i<z.length;i++){
            for (let j=0;j<z[i];j++){
                let x = 720-CELL_SIZE+CELL_SIZE/2-j*CELL_SIZE ;
                let y = 380-i*CELL_SIZE-CELL_SIZE/2 ;
                drawImg( "people", x, y, CELL_SIZE, CELL_SIZE, 0 ) ;
            }
        }
        ctx.closePath();
        ctx.stroke();

        let k = [] ;
        for (let i=0;i<TOTAL_FLOORS;i++){
            k[i] = 0 ;
        }
        for (let i=0;i<this.eventHandler.peoples.length;i++){
            if (this.eventHandler.peoples[i].state == PeopleState.EXITED){
                k[this.eventHandler.peoples[i].toFloor]++ ;
                this.eventHandler.peoples[i].nextState() ;
            }
        } 

        ctx.beginPath() ;
        ctx.fillStyle = `rgb(255, 0, 0)` ;
        for (let i=0;i<k.length;i++){
            for (let j=0;j<k[i];j++){
                let x = 725+CELL_SIZE ;
                let y = 380-i*CELL_SIZE-CELL_SIZE/2 ;
                drawImg( "people", x, y, CELL_SIZE, CELL_SIZE, 0 ) ;
            }
        }
        ctx.closePath();
        ctx.stroke();

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

