console.log(`%c[Client]`, `color: cyan;`, `bounce.js loaded!`);

(() => {

    var __ = document.getElementById("canvas");
    var _  = __.getContext("2d");

    var EXPERIMENTAL = {
        BBTest: {
            enabled: false,
            description: "Enabled/Disables the ball bouncing test. (performance heavy)"
        }
    };

    //#region AUTO RESIZE
    document.addEventListener("resize", () => location.reload());
    __.setAttribute("height", window.innerHeight);
    __.setAttribute("width", window.innerWidth);
    //#endregion
    
    var getRnd  = (min, max) => { return Math.floor((Math.random() * max) + min); };

    var TPS     = 100;
    var __BALL   = {
        x:  getRnd(__.width / 4, (__.width / 4) * 3),
        y:  getRnd(__.height / 4, (__.height / 4) * 3),
        x:  __.width / 2 - 50,
        y:  __.height / 2,
        r:  15,
        dx: getRnd(-15, 15),
        dy: getRnd(-15, 15),
        color: `rgba(255,0,0,1)`
    };
    var CURHIGH = "∞";
    var BALLS   = [];

    //#region KEY EVENTS
    document.addEventListener("keydown", (e) => {
        if (e.shiftKey === true) {
            if (e.key.toUpperCase() === "F2".toUpperCase()) window.open(`https://github.com/dev-parzival/bounce`);
            if (e.key.toUpperCase() === "F4".toUpperCase()) __viewControls = !__viewControls;
            if (e.key.toUpperCase() === "F8".toUpperCase()) __randomMode = !__randomMode;
            if (e.key.toUpperCase() === "F9".toUpperCase()) __waveMode = !__waveMode;
        } else if (e.altKey === true) {
        } else if (e.ctrlKey === true) {
            if (e.key.toUpperCase() === "F2".toUpperCase()) EXPERIMENTAL.BBTest.enabled = !EXPERIMENTAL.BBTest.enabled;
            if (e.key.toUpperCase() === "F8".toUpperCase()) __crazyMode = !__crazyMode;
            if (e.key.toUpperCase() === "F9".toUpperCase()) __fullCross = !__fullCross;
        } else {
            if (e.key.toUpperCase() === "F2".toUpperCase()) addBall();
            if (e.key.toUpperCase() === "F4".toUpperCase()) removeBall();
            if (e.key.toUpperCase() === "F8".toUpperCase()) clearGame();
            if (e.key.toUpperCase() === "F9".toUpperCase()) bombBall();
        }
    });
    //#endregion

    //#region FRAME LOOP
    setInterval(() => {
        _.clearRect(0, 0, __.width, __.height);

        drawDebugStuff();

        drawBalls();
        drawFPS();

        __fpsCache++;
    }, (1000 / TPS));
    //#endregion

    //#region DRAW
    var __fullCross = true;
    var drawDebugStuff = () => {
        _.beginPath();
        
        // X-LINE
        _.rect(
            0,
            (__.height / 2) - 1,
            __.width,
            2
        );

        // Y-LINE
        _.rect(
            (__.width / 2) - 1,
            0,
            2,
            __.height
        );

        _.fillStyle = "rgba(255,255,255,0.5);";
        _.fill();

        _.closePath();
        
        if (!__fullCross) {
            _.beginPath();

            _.clearRect(0,0,__.width,(__.height/9)*4);
            _.clearRect(0,(__.height/9)*5,__.width,(__.height/9)*4);
            _.clearRect(0,0,(__.width/14)*6,__.height);
            _.clearRect((__.width/14)*8,0,__.width,__.height);
            
            _.closePath();
        }
    };
    //#endregion

    //#region DRAW BALLS
    var __crazySwitch = 0;
    var drawBalls = () => {

        BALLS.forEach((BALL, bid) => {
            _.beginPath();

            // collision check (walls)
            if (((BALL.y + BALL.r) >= __.height) || ((BALL.y - BALL.r) <= 0)) {
                if ((BALL.y - BALL.r) <= 0) BALL.y = 1 + BALL.r;
                else BALL.y = __.height - BALL.r - 1;

                if (!__randomMode) BALL.dy = -BALL.dy;
                else BALL.dy = -(BALL.dy - getRnd(-3, 3))
            }
            if (((BALL.x + BALL.r) >= __.width)  || ((BALL.x - BALL.r) <= 0)) {
                if ((BALL.x - BALL.r) <= 0) BALL.x = 1 + BALL.r;
                else BALL.x = __.width - BALL.r - 1;
                
                if (!__randomMode) BALL.dx = -BALL.dx;
                else BALL.dx = -(BALL.dx - getRnd(-3, 3))
            }

            // collision check (objects)
            if (EXPERIMENTAL.BBTest.enabled) {
                BALLS.forEach((B, i) => {
                    if (
                        (bid !== i) && (
                            (
                                ((BALL.x - BALL.r) >= (B.x - B.r)) && ((BALL.x + BALL.r) <= (B.x + B.r))
                            ) && (
                                ((BALL.y + BALL.r) >= (B.y - B.r)) && ((BALL.y - BALL.r) <= (B.y + B.r))
                            )
                        )
                    ) {
                        BALL.dy = -BALL.dy;
                    }
                    else 
                    if (
                        (bid !== i) && (
                            (
                                ((BALL.y - BALL.r) >= (B.y - B.r)) && ((BALL.y + BALL.r) <= (B.y + B.r))
                            ) && (
                                ((BALL.x + BALL.r) >= (B.x - B.r)) && ((BALL.x - BALL.r) <= (B.x + B.r))
                            )
                        )
                    ) {
                        BALL.dx = -BALL.dx;
                    }
                })
            }

            if (__crazyMode) {
                if (__crazySwitch <= 0) {
                    BALL.dx += getRnd(0, 2);
                    BALL.dy += getRnd(0, 2);
                    __crazySwitch++;
                } else if (__crazySwitch <= 1) {
                    BALL.dx -= getRnd(0, 2);
                    BALL.dy += getRnd(0, 2);
                    __crazySwitch++;
                } else if (__crazySwitch <= 2) {
                    BALL.dx -= getRnd(0, 2);
                    BALL.dy -= getRnd(0, 2);
                    __crazySwitch++;
                } else {
                    BALL.dx += getRnd(0, 2);
                    BALL.dy -= getRnd(0, 2);
                    __crazySwitch = 0;
                }
            }

            BALL.x += BALL.dx;
            BALL.y += BALL.dy;

            _.arc(BALL.x, BALL.y, BALL.r, 0, Math.PI * 2);
            _.fillStyle = BALL.color;

            _.fill();
            _.closePath();
        })
    }
    //#endregion

    //#region ADD BALL
    var addBall = () => {
        var b   = Object.create(__BALL);

        b.x     = __.width / 2;
        b.y     = __.height / 2;

        b.dx    = getRnd(-10, 10);
        b.dy    = getRnd(-10, 10);

        b.r     = getRnd(8, 30);

        b.color = `rgb(${getRnd(10,255)},${getRnd(10,255)},${getRnd(10,255)})`;
        BALLS.push(b);

        return console.log(`%c[App]`, `color: orange;`, `active balls: ${BALLS.length} (+1)`);
    }
    //#endregion
    
    //#region REMOVE BALL
    var removeBall = () => {
        if (BALLS.length <= 0) return console.log(`%c[App]`, `color: orange;`, `active balls: ${BALLS.length} (-0)`);

        BALLS.pop();

        return console.log(`%c[App]`, `color: orange;`, `active balls: ${BALLS.length} (-1)`);
    }
    //#endregion

    //#region BALL BOMB
    var bombBall = () => {
        console.log(`%c[BOMB] ball bomb started! adding +1000 objects`, `color: red; background: black;`);

        for (let b = 0; b < 1000; b++) {
            addBall();
        }

        return console.log(`%c[BOMB] ball bomb executed! added +1000 objects`, `color: red; background: black;`);
    }
    //#endregion

    //#region FPS COUNTER
    var __fpsCache      = 0;
    var __fpsCount      = 0;
    var __fpsLast       = 0;
    var __viewControls = true;
    var __waveMode     = false;
    var __randomMode    = false;
    var __crazyMode      = false;
    var drawFPS = () => {
        _.beginPath();

        if (__viewControls) {
            _.fillStyle = "rgba(0,0,0,0.6)";
            _.rect(0, 0, 418, 221);
            _.fill();
            
            _.fillStyle = "#FFFFFF";
            _.fillText(`Press F2 to increase objects.`, 4, 42);
            _.fillText(`Press F4 to decrease objects.`, 4, 58);
            _.fillText(`Press F8 destroy all objects.`, 4, 74);
            _.fillText(`Press F9 to spawn 1000 objects.`, 4, 90);

            _.fillText(`Press SHIFT+F2 to open GitHub repo.`, 4, 112);
            _.fillText(`Press SHIFT+F4 to toggle controls.`, 4, 128);
            _.fillText(`Press SHIFT+F8 to toggle random bounce.`, 4, 144);
            _.fillText(`Press SHIFT+F9 to toggle wave mode.`, 4, 160);
            
            _.fillText(`Press CTRL+F2 to toggle ball collision.`, 4, 182);
            _.fillText(`Press CTRL+F8 to toggle crazy mode.`, 4, 198);
            _.fillText(`Press CTRL+F9 to toggle splitters.`, 4, 214);

            _.fillStyle = "lime";
            if (__viewControls) _.fillText(`                                        [✓]`, 4, 128);
            if (__waveMode) _.fillText(`                                        [✓]`, 4, 160);
            if (EXPERIMENTAL.BBTest.enabled) _.fillText(`                                        [✓]`, 4, 182);
            if (__randomMode) _.fillText(`                                        [✓]`, 4, 144);
            if (__crazyMode) _.fillText(`                                        [✓]`, 4, 198);
            if (__fullCross) _.fillText(`                                        [✓]`, 4, 214);

            _.fillStyle = "red";
            if (!__viewControls) _.fillText(`                                        [X]`, 4, 128);
            if (!__waveMode) _.fillText(`                                        [X]`, 4, 160);
            if (!EXPERIMENTAL.BBTest.enabled) _.fillText(`                                        [X]`, 4, 182);
            if (!__randomMode) _.fillText(`                                        [X]`, 4, 144);
            if (!__crazyMode) _.fillText(`                                        [X]`, 4, 198);
            if (!__fullCross) _.fillText(`                                        [X]`, 4, 214);
        }

        
        _.font = "16px Consolas";
        _.fillStyle = "#FFFFFF";
        var fpsString = (`${__fpsCount}`.length < 3) ? ((`${__fpsCount}`.length < 2) ? `  ${__fpsCount}` : ` ${__fpsCount}`) : `${__fpsCount}`;
        _.fillText(`${fpsString} FPS <${BALLS.length} of ${CURHIGH} objects ${(__waveDirection>0) ? ((__waveDirection<2) ? `↑` : `↓`) : `~`}>`, 4, 20);

        _.closePath()

    }
    setInterval(() => {
        __fpsLast  = __fpsCount
        __fpsCount = __fpsCache;
        __fpsCache = 0;;

        var _diff = __fpsCount - __fpsLast;
        var _info = (_diff >= 0) ? `+${_diff} increase` : `-${-_diff} decrease`;
        console.log(`%c[Perf]`, `color: yellow;`, `current performance: ${__fpsCount} FPS (${_info}) while rendering ${BALLS.length} of ${CURHIGH} objects.`);
    }, 1000);
    //#endregion

    //#region WAVE MODE
    var __waveModeInit = false;
    var __waveModeState = false;
    var __waveModeMax   = 1;
    var __waveDirection=0;
    var doWaveTick = () => {
        if (!__waveModeInit) __waveModeInit = true;

        if (__waveMode) {
            
            if (!__waveModeState) {
                CURHIGH = `${Math.floor(__waveModeMax)}`;
                if (BALLS.length-1 < __waveModeMax) {
                    addBall();
                    __waveDirection = 1;
                    return setTimeout(doWaveTick, 10);
                }
                __waveModeState = !__waveModeState;
            } else {
                if (BALLS.length >= 1) {
                    removeBall();
                    __waveDirection = 2;
                    return setTimeout(doWaveTick, 10);
                } else {
                    __waveModeMax = __waveModeMax + (__waveModeMax * 0.5);
                    __waveModeState = !__waveModeState;
                    __waveDirection = 0;
                }
            }

        }
        else {
            __waveModeMax   = 1;
            __waveDirection = 0;
            CURHIGH = "∞";
        };
        
        return setTimeout(doWaveTick, 10);
    }
    (() => {
        if (!__waveModeInit) doWaveTick();
    })();
    //#endregion

    //#region CLEAR FIELD
    var clearGame = () => { for (let i = 0; i < BALLS.length; i++) BALLS = []; };
    //#endregion

})();
