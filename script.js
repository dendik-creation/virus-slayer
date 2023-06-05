var game = {
    home : {
        homeUI : document.getElementById('home'),
        username : document.querySelector('.username'),
        btnSubmit : document.querySelector('.submit'),
    },
    countdown : {
        countdownUI : document.getElementById('countdown'),
        countTime : document.querySelector('.countTime'),
        countInt : 3
    },
    gameplay : {
        gameplayUI : document.getElementById('gameplay'),
        board : {
            boardArea : document.getElementById('board'),
            danger : document.querySelector('.danger'),
            virus  : document.getElementById('virus'),
            gates  : document.getElementById('gates'),
            peluruD : document.getElementById('dArea'),
            peluruF : document.getElementById('fArea'),
            peluruJ : document.getElementById('jArea'),
            peluruK : document.getElementById('kArea'),
        },
        statistic : {
            player : document.getElementById('player'),
            time : document.getElementById('time'),
            score : document.getElementById('score'),
            fail : document.getElementById('fail'),
            hint : document.getElementById('hint')
        },
    },
    pause : {
        pauseUI : document.getElementById('pause'),
        pauseWrap : document.querySelector('.pauseUI'),
        btnContinue : document.getElementById('continue'),
        btnRestart : document.getElementById('restarrt'),
    },
    gameOver : {
        gameOverUI : document.getElementById('gameOver'),
        gameOverWrap : document.querySelector('.gameOverUI'),
        result : {
            player : document.getElementById('nameRes'),
            time : document.getElementById('timeRes'),
            score : document.getElementById('scoreRes'),
        }
    },
    states : {
        pause : false,
        time : 1,
        score : 0,
        fail : 0,
    },
    mainAudio : new Audio('./audio/main_sound.webm'),
}

window.onload = () => {
    userCheck();
    game.countdown.countdownUI.style.display = 'none';
    game.gameplay.gameplayUI.style.display = 'none';
    game.gameplay.board.peluruD.style.display = 'none';
    game.gameplay.board.peluruF.style.display = 'none';
    game.gameplay.board.peluruJ.style.display = 'none';
    game.gameplay.board.peluruK.style.display = 'none';
    game.pause.pauseUI.style.display = 'none';
    game.gameplay.statistic.hint.style.display = 'none';
    game.gameOver.gameOverUI.style.display = 'none';
}

function userCheck(){
    game.home.username.addEventListener('input', () => {
        if(game.home.username.value.length > 0){
            game.home.btnSubmit.removeAttribute('disabled');
        }else{
            game.home.btnSubmit.setAttribute('disabled', true)
        }
    });
    game.home.btnSubmit.addEventListener('click', () => {
        if(game.home.username.value.length > 0){
            countdown();
            game.gameplay.statistic.player.innerHTML = `Name : ${game.home.username.value}`;
            game.home.homeUI.remove();
            game.gameplay.gameplayUI.style.display = 'flex';
        }else{
            alert('Input Username!');
        }
    });
    
}

function countdown(){
    game.countdown.countdownUI.style.display = 'flex';
    var interval = setInterval(() => {
        if(game.countdown.countInt <= 3){
            game.countdown.countTime.innerHTML = game.countdown.countInt;
            game.countdown.countInt--;
            new Audio ('./audio/countdown.webm').play();
        }
        if(game.countdown.countInt == 0){
            game.countdown.countInt = 3;
            clearInterval(interval);
            var timeout = setTimeout(() => {
                game.countdown.countdownUI.style.display = 'none';
                clearTimeout(timeout)
                mainEvents();
            },1000)
        }
    },1000)
}

function mainEvents(){
    if(game.states.pause === false){
        game.gameplay.statistic.hint.style.display = 'block';
        let setSpawn = [350,450,550,650,750];
        let resultSpawn = [];
        
        for(var i=0; i<1; i++){
            let index = Math.floor(Math.random() *  setSpawn.length);
            resultSpawn.push(setSpawn[index]);
            setSpawn.splice(index, 1);
        }
        keyClick();
        setInterval(gameTime, 1000);
        setInterval(createVirus, resultSpawn);
        setInterval(updateVirus, 16);
        setInterval(countFail, 18);
        pauseGame();
        game.mainAudio.play();
    }
}

function gameTime(){
    if(game.states.pause === false){
            let minute = Math.floor(game.states.time/60);
            let second = game.states.time % 60;
            game.states.time++;
            second = second < 10 ? '0' + second : second;
            minute = minute < 10 ? '0' + minute : minute;
            game.gameplay.statistic.time.innerHTML = `Time : ${minute} : ${second}`;
    }
}

function keyClick(){
    document.addEventListener('keyup', (e) => {
        if(game.states.pause == false){
            if(e.code == 'KeyD'){
                game.gameplay.board.peluruD.style.display = 'block';
                setTimeout(() => {
                    game.gameplay.board.peluruD.style.display = 'none';
                },50)
                collision();
            }
            if(e.code == 'KeyF'){
                game.gameplay.board.peluruF.style.display = 'block';
                setTimeout(() => {
                    game.gameplay.board.peluruF.style.display = 'none';
                },50)
                collision();
            }
            if(e.code == 'KeyJ'){
                game.gameplay.board.peluruJ.style.display = 'block';
                setTimeout(() => {
                    game.gameplay.board.peluruJ.style.display = 'none';
                },50)
                collision();
            }
            if(e.code == 'KeyK'){
                game.gameplay.board.peluruK.style.display = 'block';
                setTimeout(() => {
                    game.gameplay.board.peluruK.style.display = 'none';
                },50)
                collision();
            }
        }
    });
}

function pauseGame(){
    document.addEventListener('keyup', (e) => {
        if(e.code == 'Escape'){
            if(game.states.pause === false){
                game.mainAudio.pause();
                game.states.pause = true;
                game.gameplay.statistic.hint.innerHTML = '>> ESC to continue game';
                game.pause.pauseUI.style.display = 'flex';
                game.pause.pauseWrap.style.animation = 'pauseGame ease 500ms';
                console.log(game.states.pause);
            }
            else{
                countdownPause();
                continueGame();
                setTimeout(() => {
                    game.mainAudio.play();
                    game.states.pause = false;
                    console.log(game.states.pause);
                },4500)
            }
        }
    });
    
    game.pause.btnContinue.addEventListener('click', () => {
        countdownPause();
        continueGame();
        setTimeout(() => {
            game.states.pause = false;
            console.log(game.states.pause);
            game.gameplay.statistic.hint.innerHTML = '>> ESC to pause game';
        },4500)
    });
}

function countdownPause(){
    game.countdown.countTime.innerHTML = '';
    setTimeout(() => {
        var interval = setInterval(() => {
            if(game.countdown.countInt <= 3){
                game.countdown.countTime.innerHTML = game.countdown.countInt;
                game.countdown.countInt--;
                new Audio ('./audio/countdown.webm').play();
            }
            if(game.countdown.countInt == 0){
                game.countdown.countInt = 3;
                clearInterval(interval);
                var timeout = setTimeout(() => {
                    game.countdown.countdownUI.style.display = 'none';
                    clearTimeout(timeout);
                },1000)
            }
        },1000)
    },400)
}

function continueGame(){
    game.pause.pauseWrap.style.animation = 'closePause ease 500ms';
    setTimeout(() => {
        game.countdown.countdownUI.style.display = 'flex';
        game.pause.pauseUI.style.display = 'none';
    },400)
}

function createVirus(){
    if(game.states.pause == false){
        let setLocate = [0,25,50,75];
        let resultLocate = [];
    
        for(var i=0; i<1; i++){
            let index = Math.floor(Math.random() *  setLocate.length);
            resultLocate.push(setLocate[index]);
            setLocate.splice(index, 1);
        }
    
        var virus = document.createElement('div');
        virus.setAttribute('width', '75px');
        virus.setAttribute('height', '75px');
        virus.setAttribute('id', 'virus');
        virus.style.left = `calc(${resultLocate}% + 11px)`;
        game.gameplay.board.boardArea.appendChild(virus);
    }
}

function updateVirus(){
    if(game.states.pause == false){
        let virusAll = document.querySelectorAll('#virus');
        for(var i = 0; i < virusAll.length; i++){
            var virus = virusAll[i];
            let update = parseInt(window.getComputedStyle(virus).getPropertyValue("top"));
            virus.style.top = update + 5 + 'px';
        }
    }
}

function collision(){
    if(game.states.pause == false){
        var viruses = document.querySelectorAll('#virus');
        var pelurues = document.getElementsByClassName('peluru');

        for(i=0; i<pelurues.length; i++){
            var peluru = pelurues[i];
            for(j=0; j<viruses.length; j++){
                var virus = viruses[j];

                if(virus != undefined){
                    var virusBound = virus.getBoundingClientRect();
                    var peluruBound = peluru.getBoundingClientRect();
    
                    if(peluruBound.left < virusBound.right &&
                        peluruBound.right > virusBound.left &&
                        peluruBound.top < virusBound.bottom &&
                        peluruBound.bottom > virusBound.top)
                    {
                        virus.parentElement.removeChild(virus);
                        new Audio('./audio/kill.wav').play();
                        game.states.score++;
                        game.gameplay.statistic.score.innerHTML = `Score : ${game.states.score}`;
                    }
                }
            }
        }
    }
}

function countFail(){
    if(game.states.pause == false){
        var viruses = document.querySelectorAll('#virus');
        var gates = document.querySelectorAll('#gates');

        for(i=0; i<gates.length; i++){
            var gate = gates[i];
            for(j=0; j<viruses.length; j++){
                var virus = viruses[j];

                if(virus != undefined){
                    var virusBound = virus.getBoundingClientRect();
                    var gateBound = gate.getBoundingClientRect();
    
                    if(virusBound.left < gateBound.right &&
                        virusBound.right > gateBound.left &&
                        virusBound.top < gateBound.bottom &&
                        virusBound.bottom > gateBound.top)
                    {;
                        virus.parentElement.removeChild(virus);
                        new Audio('./audio/gates.mp3').play();
                        game.gameplay.board.gates.style.backgroundColor = 'rgba(255,255,255,0.6)'
                        game.states.fail++;
                        game.gameplay.statistic.fail.innerHTML = `Fail : ${game.states.fail}`;
                        setTimeout(() => {
                            game.gameplay.board.gates.style.backgroundColor = '#1c1c1c'
                        },500)
                    }
                }
            }
        }
        if(game.states.fail == 10){
            game.states.pause = true;
            game.gameplay.statistic.hint.remove();
            setTimeout(() => {
                game.mainAudio.pause();
                game.gameOver.gameOverUI.style.display = 'flex';
                game.gameOver.gameOverWrap.style.animation = 'pauseGame ease 500ms'
                gameOver();
            },400)
        }
    }
}

function gameOver(){
    game.gameOver.result.player.innerHTML = `Name : ${game.home.username.value}`;
    game.gameOver.result.time.innerHTML = game.gameplay.statistic.time.innerHTML;
    game.gameOver.result.score.innerHTML = `Score : ${game.states.score}`;
}