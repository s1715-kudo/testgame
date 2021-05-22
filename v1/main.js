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
            gamefield.move(btnClickPlace[1],btnClickPlace[0],j,i,true)
            gamefield.display("message","game")
            var fin_flag=fin()
            if(!fin_flag)randMove();
        }
        btnClickFlag=!btnClickFlag
    }
}

function fin(){
    var fin_flag=gamefield.isPieceA()
    var c_top="<a href='index.html'>トップに戻る</a>"
    if(fin_flag!=-1){
        gamefield.setFinRecord(fin_flag)
        switch(fin_flag){
            case 0:
                document.getElementById("message").innerHTML="WIN 1　"+c_top
                break;
            case 1:
                document.getElementById("message").innerHTML="WIN 2　"+c_top
                break;
            case -2:
                document.getElementById("message").innerHTML="DRAW"
                break;
        }
    }
    return fin_flag!=-1;
}

function randMove(){
    if(gamefield.turn==0&&randMoveFlag[0]||gamefield.turn==1&&randMoveFlag[1]){
        gamefield.randSelectMove()
        gamefield.display("message","game")
    }
    return fin()
}

function getParam(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setKeyinit(key,value){
	var url_key=getParam(key);
	if(url_key==null)url_key=value;
	else if((typeof value)=="number")url_key=Number(url_key);
	return url_key;
}

var randMoveFlag=[setKeyinit('1p',"false")=="true",setKeyinit('2p',"false")=="true"]

window.addEventListener('load', function(){
    gamefield.display("message","game")
    randMove();
    if(randMoveFlag[0]&&randMoveFlag[1]){
        var fin_flag=false
        while(!fin_flag){
            fin_flag=randMove()
        }
    }
});