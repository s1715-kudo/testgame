function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function initState(size){
    var init_state=[]
    var s0_sum=0;
    var N=9;
    while(s0_sum<25){
        var s0=[];
        for(var i=0;i<size;i++){
            s0.push(getRandomInt(N)+1);
        }
        init_state.push(s0);
        s0_sum=arraySum(s0);
    }

    var flag=true
    while(flag){
        var s0=[];
        var maxn=s0_sum;
        for(var i=0;i<size-1;i++){
            var n=getRandomInt(N)+1
            maxn-=n;
            s0.push(n);
        }
        if(maxn>0&&maxn<=N){
            s0.push(maxn);
            flag=false;
            init_state.push(s0)
        }
    }

    return init_state 
}

function arraySum(array){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return array.reduce(reducer)
}

class Field{
    f=[];
    size=[];
    turn=0;
    constructor(){
        this.size=[5,5];
        this.turn=0;
        
        for(var i=0;i<this.size[0];i++){
            var f0=[];
            for(var j=0;j<this.size[1];j++){
                f0.push(new Piece(null,0,null,i,j));
            }
            this.f.push(f0);
        }

        var init_state=initState(this.size[1]);
        var init_piece=[1,2,3,2,1];

        for(var i=0;i<this.size[1];i++){
            this.f[0][i]=new Piece(0,init_piece[i],init_state[0][i],i,0);
            this.f[this.size[0]-1][i]=new Piece(1,init_piece[i],init_state[1][i],i,this.size[0]-1);
        }
    }

    move(x,y,mx,my){
        if(this.isFieldRange(x,y)&&this.isFieldRange(mx,my)){
            var p=this.f[y][x];
            var p0=this.f[my][mx];
            if(Math.abs(mx-x)<=1&&Math.abs(my-y)<=1){
                if(p.turn==this.turn){
                    if(p.isVec(mx-x+1,my-y+1)){
                        if(p0.type==0){
                            this.f[my][mx]=new Piece(p.turn,p.type,p.state,mx,my);
                            this.f[y][x]=new Piece(null,0,null,x,y);
                            this.turn=(this.turn+1)%2
                            return true
                        }
                        else if(p0.turn!=p.turn){
                            if(p0.state<p.state){
                                this.f[my][mx]=new Piece(p.turn,p.type,p.state,mx,my);
                                this.f[y][x]=new Piece(null,0,null,x,y);
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
        return (x>=0&&y>=0&&x<this.size[0]&&y<this.size[1])
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

    isPieceC(){
        var flags=[false,false];
        for(var i=0;i<this.size[0];i++){
            for(var j=0;j<this.size[1];j++){
                if(this.f[i][j].type==3){
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
                content+=("<td><button id='cell_"+i+"_"+j+"' style='width:50px;height:50px;' onclick=btnClick("+i+","+j+")>"+this.f[i][j]+"</button></td>")
            }
            content+="</tr>"
        }
        content+="</table>"
		document.getElementById(idm).innerHTML="turn:"+(this.turn+1)
		document.getElementById(idg).innerHTML=content;
    }
}

class Piece{
    turn=0;
    type=0;
    state=0;
    x=0;
    y=0;

    constructor(turn,type,state,x,y){
        this.turn=turn;
        this.type=type;
        this.state=state;
        this.x=x;
        this.y=y;
    }

    isVec(dx,dy){
        var is_move_array=[
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
                return 'A'
            case 2:
                return 'B'
            case 3:
                return 'C'
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
