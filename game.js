function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function arraySum(array){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return array.reduce(reducer)
}

function arrayCreate(start,end){
    var array=[];
    for(i=start;i<=end;i++){
        array.push(i);
    }
    return array;
}

function arrayShuffle(array){
    var newArray = [];
    while (array.length > 0) {
        n = array.length;
        k = Math.floor(Math.random() * n);
        newArray.push(array[k]);
        array.splice(k, 1);
    }
    return newArray
}

class Field{
    f=[];
    size=[];
    turn=0;
    constructor(){
        this.size=[7,5];
        this.turn=0;
        
        for(var i=0;i<this.size[0];i++){
            var f0=[];
            for(var j=0;j<this.size[1];j++){
                f0.push(new Piece(null,0,null,i,j,false));
            }
            this.f.push(f0);
        }
        this.init()
    }

    init(){
        var init_piece=[[2,3,4,3,2],[1,1,1,1,1]];
        var init_state=[];
        for(var i=0;i<init_piece.length;i++){
            var s0=arrayShuffle(arrayCreate(0,9));
            var s1=[s0.slice(0,5),s0.slice(5)]
            init_state.push(s1)
        }

        for(var i=0;i<init_piece.length;i++){
            for(var j=0;j<this.size[1];j++){
                this.f[i][j]=new Piece(0,init_piece[i][j],init_state[0][i][j],j,i,false);
                this.f[this.size[0]-i-1][j]=new Piece(1,init_piece[i][j],init_state[1][i][j],j,this.size[0]-i-1,false);
            }
        }

    }

    stdMove(x,y,mx,my,p){
        var ntype=p.type
        var nstate=p.state
        var nbflag=p.bflag
        if(!nbflag&&((p.turn==0&&my==this.size[0]-1)||(p.turn==1&&my==0))){
            if(ntype==1){
                ntype=2
                nbflag=true;
            }
            else if(ntype==2||ntype==3){
                nstate+=2
                if(nstate>9){
                    nstate=9
                }
                nbflag=true;
            }
        }
        this.f[my][mx]=new Piece(p.turn,ntype,nstate,mx,my,nbflag);
        this.f[y][x]=new Piece(null,0,null,x,y,false);
    }

    move(x,y,mx,my){
        if(this.isFieldRange(x,y)&&this.isFieldRange(mx,my)){
            var p=this.f[y][x];
            var p0=this.f[my][mx];
            if(Math.abs(mx-x)<=1&&Math.abs(my-y)<=1){
                if(p.turn==this.turn){
                    if(p.isVec(mx-x+1,my-y+1)){
                        if(p0.type==0){
                            this.stdMove(x,y,mx,my,p);
                            this.turn=(this.turn+1)%2
                            return true
                        }
                        else if(p0.turn!=p.turn){
                            if(p0.state<p.state){
                                p.state++
                                if(p.state>9)p.state=9
                                this.stdMove(x,y,mx,my,p);
                                this.turn=(this.turn+1)%2
                                return true
                            }
                            else if(p0.state==p.state){
                                this.f[my][mx]=new Piece(null,0,null,mx,my);
                                this.f[y][x]=new Piece(null,0,null,x,y);
                                this.turn=(this.turn+1)%2
                                return true
                            }
                            else return false
                        }
                        else return false
                    }
                    else return false
                }
                else return false
            }
            else return false
        }
        else return false
    }

    isFieldRange(x,y){
        return (x>=0&&y>=0&&x<this.size[1]&&y<this.size[0])
    }

    console_print(){
        console.log("　   1   2   3   4   5 ")
        console.log("   --------------------")
        for(var i=0;i<this.size[0];i++){
            var str=i+1+" | ";
            for(var j=0;j<this.size[1];j++){
                str+=this.f[i][j]+" "
            }
            console.log(str)
        }
    }

    isPieceA(){
        var flags=[false,false];
        for(var i=0;i<this.size[0];i++){
            for(var j=0;j<this.size[1];j++){
                if(this.f[i][j].type==4){
                    flags[this.f[i][j].turn]=true
                }
            }
        }
        var r=-1;
        if(flags[0]&&flags[1])r=-1
        else if(flags[0]&&!flags[1])r=0
        else if(!flags[0]&&flags[1])r=1
        else r=-2;
        return r
    }

    display(idm,idg){
        var content=""
        content+="<table>"
        for(var i=0;i<this.size[0];i++){
            content+="<tr>"
            for(var j=0;j<this.size[1];j++){
                var c_color;
                switch(this.f[i][j].turn){
                    case 0:
                        c_color="color0"
                        break;
                    case 1:
                        c_color="color1"
                        break;
                    default:
                        c_color="colord"
                        break;
                }

                content+=("<td><button id='cell_"+i+"_"+j+"' class='cell "+c_color+"' onclick=btnClick("+i+","+j+")><div class='cell_body'><img id='cell_img_"+i+"_"+j+"' src='img/"+this.f[i][j].type+".png' /><p>"+this.f[i][j].toString().slice(1)+"</p></div></button></td>")
            }
            content+="</tr>"
        }
        content+="</table>"
		document.getElementById(idm).innerHTML="TURN "+(this.turn+1)
		document.getElementById(idg).innerHTML=content;
    }
}

class Piece{
    turn=0;
    type=0;
    state=0;
    x=0;
    y=0;
    bflag=false;

    constructor(turn,type,state,x,y,bflag){
        this.turn=turn;
        this.type=type;
        this.state=state;
        this.x=x;
        this.y=y;
        this.bflag=bflag;
    }

    isVec(dx,dy){
        var is_move_array=[
            [[false,false,false],[true,false,true],[false,false,false]],
            [[false,true,false],[true,false,true],[false,true,false]],
            [[true,false,true],[false,false,false],[true,false,true]],
            [[true,true,true],[true,false,true],[true,true,true]]
        ]
        if(dx>1&&dy>1&&dx<-1&&dy<-1)return false;
        else return is_move_array[this.type-1][dx][dy];
    }

    typeStr(){
        switch(this.type){
            case 0:
                return ' '
            case 1:
                return 'D'
            case 2:
                return 'C'
            case 3:
                return 'B'
            case 4:
                return 'A'
        }
    }

    toString(){
        var statestr=""
        var turnstr=""
        if(this.state==null)statestr=" "
        else statestr=this.state
        if(this.turn==null)turnstr=" "
        else turnstr=this.turn+1
        return turnstr+this.typeStr()+statestr;
    }
}
