var btnClickFlag=false
var btnClickPlace=[-1,-1];
var gamefield=new Field();

function btnClick(i,j){
    if(gamefield.isPieceA()==-1){
        if(!btnClickFlag){
            btnClickPlace[0]=i;
            btnClickPlace[1]=j;
            document.getElementById("cell_"+i+"_"+j).classList.add("cell_select")
        }
        else{
            gamefield.move(btnClickPlace[1],btnClickPlace[0],j,i)
            gamefield.display("message","game")
            switch(gamefield.isPieceA()){
                case 0:
                    document.getElementById("message").innerHTML="1の勝ち"
                    break;
                case 1:
                    document.getElementById("message").innerHTML="2の勝ち"
                    break;
                case -2:
                    document.getElementById("message").innerHTML="引き分け"
                    break;
            }
        }
        btnClickFlag=!btnClickFlag
    }
}

window.onload = function(){
    gamefield.display("message","game")
}