class GameControl {
    static STATE_STOP = 1 ;
    static STATE_RUNNING = 2 ;
    static STATE_PAUSE = 3 ;
    state = GameControl.STATE_STOP ;
    callbacks = [] ;

    constructor() {
        document.addEventListener('keydown', this.keydown.bind(this) );
    }

    addEventListener(eventName, callback) {
        this.callbacks[eventName] = callback ;
    }

    _doCallbacks(eventName) {
        let cb = this.callbacks[eventName] ;
        if ( cb != null ) {
            cb();
        }
    }

    keydown(event) {
        if (event.key === "Escape") {  // 檢查是否按下了 Esc 鍵
            if ( this.state == GameControl.STATE_RUNNING ) {
                this.pause();
            } else if (this.state == GameControl.STATE_PAUSE) {
                this.resume() ;
            }
        }
    }

    stop() {
        this.state = GameControl.STATE_STOP ;
        document.getElementById("playBtn").style.display = 'block' ;
        document.getElementById("resumeBtn").style.display = 'none' ;
        document.getElementById("level").disabled = false  ;
        document.getElementById("players").disabled = false ;
        gameMenuObj.style.display = 'block';
    }

    start() {
        if ( this.state != GameControl.STATE_STOP ) {
            return ;
        }
        this.state = GameControl.STATE_RUNNING ;
        gameMenuObj.style.display = 'none';
        this.players = parseInt( document.getElementById("players").value ); 
        this.level = parseInt( document.getElementById("level").value ); 
        this.audio = parseInt( document.getElementById("audio").value ); 
        this._doCallbacks("start") ;
    }

    pause() {
        if ( this.state != GameControl.STATE_RUNNING ) {
            return ;
        }
        this.state = GameControl.STATE_PAUSE ;
        document.getElementById("playBtn").style.display = 'none' ;
        document.getElementById("resumeBtn").style.display = 'block' ;
        document.getElementById("level").disabled = true;
        document.getElementById("players").disabled = true ;
        gameMenuObj.style.display = 'block';
    }

    resume() {
        if ( this.state != GameControl.STATE_PAUSE ) {
            return ;
        }
        this.state = GameControl.STATE_RUNNING ;
        gameMenuObj.style.display = 'none';
    }

}

let html = `
    <div id="GameMenu" style="position:absolute; width:200px; height:350px; background:#56d977; border:3px solid #566cff">
        <table width="100%" height="100%" style="margin-left: auto;margin-right: auto;">
            <tr><td align="center" valign="center">
                玩家人數：
                <SELECT id="players">
                    <OPTION value="1" selected>單人</OPTION>
                    <OPTION value="2">雙人</OPTION>
                </SELECT>
            </td></tr>
            <tr><td align="center" valign="center">
                等級：
                <SELECT id="level">
                    <OPTION value="1" selected>Easy</OPTION>
                    <OPTION value="2">Medium</OPTION>
                    <OPTION value="3">Hard</OPTION>
                </SELECT>
            </td></tr>
            <tr><td align="center" valign="center">
                音效：
                <SELECT id="audio">
                    <OPTION value="1" selected>Open</OPTION>
                    <OPTION value="0">Close</OPTION>
                </SELECT>
            </td></tr>
            <tr><td align="center" valign="center">
                <button id="playBtn" type="button" size="20" onclick="gameControl.start()">開始</button>
                <button id="resumeBtn" type="button" size="20" onclick="gameControl.resume()">繼續</button>
            </td></tr>
        </table>
    </div>
` ;

let gameControl = new GameControl() ;
let gameMenuObj = null;

window.addEventListener('load', function() {
    var newElement = document.createElement("p");
    newElement.innerHTML = html ;
    document.body.appendChild(newElement);
    gameMenuObj = document.getElementById("GameMenu") ;
    gameControl.stop();
    resize() ;
});

function resize() {
    const computedStyle = window.getComputedStyle(gameMenuObj);
    gameMenuObj.style.top = `${window.innerHeight/2 - parseFloat(computedStyle.height)/2}px` ;
    gameMenuObj.style.left =`${window.innerWidth/2 - parseFloat(computedStyle.width)/2}px` ; 
}
window.addEventListener('resize', resize) ;

