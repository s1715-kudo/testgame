var btnClickFlag=false
var btnClickPlace=[-1,-1];
var gamefield=new Field();

function btnClick(i,j){
    if(gamefield.isPieceA()==-1){
        if(!btnClickFlag){
            btnClickPlace[0]=i;
            btnClickPlace[1]=j;
            var cell_select_str="cell_select"
            cell_select_str+=gamefield.turn;
            document.getElementById("cell_"+i+"_"+j).classList.add(cell_select_str)
            document.getElementById("cell_img_"+i+"_"+j).classList.add("cell_select_img")
        }
        else{
            gamefield.move(btnClickPlace[1],btnClickPlace[0],j,i)
            gamefield.display("message","game")
            switch(gamefield.isPieceA()){
                case 0:
                    document.getElementById("message").innerHTML="WIN 1"
                    break;
                case 1:
                    document.getElementById("message").innerHTML="WIN 2"
                    break;
                case -2:
                    document.getElementById("message").innerHTML="DRAW"
                    break;
            }
        }
        btnClickFlag=!btnClickFlag
    }
}

window.onload = function(){
    gamefield.display("message","game")
}