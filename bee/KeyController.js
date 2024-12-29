class KeyController {
    static ids = 0 ;
    id = KeyController.ids++ ;
    keysState = new Map() ;
    constructor( padIdx ) {
        this.padIdx = padIdx ;
        if ( this.id != 0 ) {
            this.keyCodeLeft = "ArrowLeft" ;
            this.keyCodeRight = "ArrowRight" ;
            this.keyCodeDown = "ArrowDown" ;
            this.keyCodeUp = "ArrowUp" ;
            this.keyCodeToX = "KeyH" ;
            this.keyCodeToA = "KeyN" ;
            this.keyCodeToB = "KeyM" ;
            this.keyCodeToY = "KeyJ" ;
        } else {
            this.keyCodeLeft = "KeyA" ;
            this.keyCodeRight = "KeyD" ;
            this.keyCodeDown = "KeyS" ;
            this.keyCodeUp = "KeyW" ;
            this.keyCodeToX = "KeyF" ;
            this.keyCodeToA = "KeyC" ;
            this.keyCodeToB = "KeyV" ;
            this.keyCodeToY = "KeyG" ;
        }
        this._init() ;
    }
    _init() {
        document.addEventListener("keydown", this._keyDown.bind(this) );
        document.addEventListener("keyup", this._keyUp.bind(this) );
    }
    _keyDown(event) {
        this.keysState.set( event.code, true ) ;
    }
    _keyUp(event){
        this.keysState.set( event.code, false ) ;
    }
    isArrowLeftPressed() {
        let flag = this.keysState.get( this.keyCodeLeft ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if ( gamepad != null && gamepad.axes[0] == -1 ) {
            return true ;
        }
        return false ;
    }
    isArrowRightPressed() {
        let flag = this.keysState.get( this.keyCodeRight ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if ( gamepad != null &&  gamepad.axes[0] == 1 ) {
            return true ;
        }
        return false ;
    }
    isArrowDownPressed() {
        let flag = this.keysState.get( this.keyCodeDown ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if (  gamepad != null && gamepad.axes[1] == 1 ) {
            return true ;
        }
        return false ;
    }
    isArrowUpPressed() {
        let flag = this.keysState.get( this.keyCodeUp ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if (  gamepad != null && gamepad.axes[1] == -1 ) {
            return true ;
        }
        return false ;
    }
    isButtonAPressed() {
        let flag = this.keysState.get( this.keyCodeToA ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if (  gamepad != null && gamepad.buttons[0].pressed ) {
            return true ;
        }
        return false ;
    }
    isButtonBPressed() {
        let flag = this.keysState.get( this.keyCodeToB ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if (  gamepad != null && gamepad.buttons[1].pressed ) {
            return true ;
        }
        return false ;
    }
    isButtonXPressed() {
        let flag = this.keysState.get( this.keyCodeToX ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if (  gamepad != null && gamepad.buttons[2].pressed ) {
            return true ;
        }
        return false ;
    }
    isButtonYPressed() {
        let flag = this.keysState.get( this.keyCodeToY ) ;
        if ( flag != null && flag == true ) {
            return true ;
        }
        let gamepad = navigator.getGamepads()[this.padIdx] ;
        if (  gamepad != null && gamepad.buttons[3].pressed ) {
            return true ;
        }
        return false ;
    }

}

class KeyControllerFake extends KeyController {
    constructor() {
        super(10) ;
    }
    _init() {}

    keyPress(keyCode, ms) {
        this._keyDown(keyCode) ;
        setTimeout( () => {
            this._keyUp(keyCode) ;
        }, ms) ;
    }
    _keyDown(keyCode) {
        this.keysState.set( keyCode, true ) ;
    }
    _keyUp(keyCode){
        this.keysState.set( keyCode, false ) ;
    }
}
