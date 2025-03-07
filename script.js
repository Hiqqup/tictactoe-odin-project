let ttt = (function(){
    const game = (function (){
            const KEY = {
            occupied: "occupied",
            won: "won",
            draw: "draw",
            placed: "placed"
        }
        let gameOver = false;
        function boardMaker(){
            const EMPTY_ELEMENT = '-'
            const data = Array.from( {length: 3}, () => Array.from({length:3}, ()=> EMPTY_ELEMENT ));
            let marksSet = 0;
            function setMark(x,y,mark){
                function checkWin(){
                    function lineSum(xmod,ymod){
                        let res = 0;
                        for(let i = -2; i <= 2; i++){
                            let lx = x + (xmod*i);
                            let ly = y + (ymod*i);
                            if(lx<0 || ly < 0 || lx > 2 || ly > 2) continue;
                            if(data[lx][ly] === mark) res++;
                        }
                        return res
                    }
                    return (
                        lineSum(0,1) === 3 ||
                        lineSum(1,0) === 3 ||
                        lineSum(1,-1) === 3 ||
                        lineSum(1,1) === 3 
                    );
                }
                function checkDraw(){
                    marksSet ++;
                    return marksSet >= 9
                }
                if (data[x][y] === EMPTY_ELEMENT){
                    data[x][y] = mark;
                    if(checkWin()) return KEY.won;
                    if(checkDraw()) return KEY.draw;
                }
                else{
                    return KEY.occupied;
                }
                return KEY.placed;
            }
            function print(){
                console.log("field:")
                for(i of  data){
                    let str = "";
                    for( j of i){
                        str+= j;
                    }
                    console.log(str )
                }
            }
            return {setMark, print};
        }
        let board = boardMaker();
        const turn = (function(){
            let playerAtTurn = 'x';
            function get(){
                return playerAtTurn;
            }
            function update(){
                playerAtTurn = playerAtTurn === 'x' ? 'o' : 'x';
            }
            return {get, update}
        })();
        function getTurn(){
            return turn.get() ;
        }
        function getGameOver(){
            return gameOver;
        }
        function reset(){
            gameOver = false;
            board = boardMaker();
        }
        function setMark(x,y){
            if(gameOver) return "Game is over.";
            if(x > 2 || y > 2) return "Error - index out of bounds";
            const key = board.setMark(x,y,turn.get());
            switch (key){
                case KEY.occupied:
                    return KEY.occupied;
                case KEY.won:
                    gameOver= true;
                    return turn.get() + " won.";
            }
            turn.update()
            return '-';
            //board.print();
        }
        return {setMark, reset, getTurn,getGameOver};
    })();
    (function dom (){
        const container = document.querySelector("#gameContainer")
        const output = document.querySelector("output");
        function displayField(){
            for(let i = 0 ;i < 3; i++){
                const subcontainer = document.createElement("div");
                for(let j = 0; j < 3; j++){
                    const field = document.createElement("button");
                    field.classList.add("tttField");
                    field.textContent = '_';
                    field.addEventListener("click", ()=> {
                        if(!game.getGameOver()){
                            const mark = game.getTurn();
                            output.textContent = game.setMark(i,j)
                            if(output.textContent !== "occupied") field.textContent = mark;
                        }
                    });
                    subcontainer.appendChild(field);
                }
                container.appendChild(subcontainer);
            }
        }
        document.querySelector("#resetButton").addEventListener("click",()=>{ 
            game.reset();
            output.textContent = "-";
            container.innerHTML = "";
            displayField();
         });
        displayField();
    })();
})();