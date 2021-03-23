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

function arrayRotate(array2d){
    var newArray2d = newArray2d = new Array(array2d.length);
    for(var i=0;i<newArray2d.length;i++){
        newArray2d[i]=new Array(array2d[i].length);
    }

    for(var i=0;i<array2d.length;i++){
        for(var j=0;j<array2d[i].length;j++){
            newArray2d[i][j]=array2d[array2d.length-1-i][array2d[i].length-1-j]
        }
    }
    return newArray2d
}

class Field{
    f=[];
    size=[];
    turn=0;
    MAX_STATE=14
    record=[];
    SAVE_RECORD=true

    constructor(){
        this.size=[10,5];
        this.turn=0;
        this.SAVE_RECORD=(setKeyinit('output_result',"false")=="true")
        
        for(var i=0;i<this.size[0];i++){
            var f0=[];
            for(var j=0;j<this.size[1];j++){
                f0.push(new Piece(null,0,null,i,j,false));
            }
            this.f.push(f0);
        }
        this.init()
        this.setRecord(null,null,null,null)
    }

    init(){
        var init_piece=[[5,7,4,7,5],[2,3,6,3,2],[8,8,1,8,8]];
        var init_piecer=arrayRotate(init_piece)
        var height2=this.size[0]-init_piece.length
        var init_state=[];
        for(var i=0;i<init_piece.length;i++){
            var s0=arrayShuffle(arrayCreate(0,this.MAX_STATE));
            var s1=[s0.slice(0,5),s0.slice(5,10),s0.slice(10)]
            init_state.push(s1)
        }

        for(var i=0;i<init_piece.length;i++){
            for(var j=0;j<this.size[1];j++){
                this.f[i][j]=new Piece(0,init_piece[i][j],init_state[0][i][j],j,i,false);
                this.f[i+height2][j]=new Piece(1,init_piecer[i][j],init_state[1][i][j],j,i+height2,false);
            }
        }

    }

    stdMove(x,y,mx,my,p){
        var ntype=p.type
        var nstate=p.state
        var nbflag=p.bflag
        if(!nbflag&&this.isEnemyPosition(my,p)){
            if(ntype==1||ntype==8){
                ntype=2
            }
            else if(ntype==2||ntype==5){
                ntype=6
            }
            else if(ntype==3){
                ntype=7
            }
            else if(ntype==6||ntype==7){
                nstate+=2
                if(nstate>this.MAX_STATE){
                    nstate=this.MAX_STATE
                }
            }
            nbflag=true;
        }
        this.f[my][mx]=new Piece(p.turn,ntype,nstate,mx,my,nbflag);
        this.f[y][x]=new Piece(null,0,null,x,y,false);
    }

    isEnemyPosition(my,p){
        var heightRange=3
        if(p.turn==0){  
            return (my>=this.size[0]-heightRange && my<this.size[0])
        }
        else if(p.turn==1){
            return (my>=0 && my<heightRange)
        }
    }

    move(x,y,mx,my,moveflag){
        var rflag=false
        if(this.isFieldRange(x,y)&&this.isFieldRange(mx,my)){
            var p=this.f[y][x];
            var p0=this.f[my][mx];
            if(Math.abs(mx-x)<=1&&Math.abs(my-y)<=1){
                if(p.turn==this.turn){
                    if(p.isVec(mx-x+1,my-y+1)){
                        if(p0.type==0){
                            if(moveflag){
                                this.stdMove(x,y,mx,my,p);
                                this.turn=(this.turn+1)%2
                            }
                            rflag=true
                        }
                        else if(p0.turn!=p.turn){
                            if(p0.state<p.state){
                                if(moveflag){
                                    p.state++
                                    if(p.state>this.MAX_STATE)p.state=this.MAX_STATE
                                    this.stdMove(x,y,mx,my,p);
                                    this.turn=(this.turn+1)%2
                                }
                                rflag=true
                            }
                            else if(p0.state==p.state){
                                if(moveflag){
                                    this.f[my][mx]=new Piece(null,0,null,mx,my);
                                    this.f[y][x]=new Piece(null,0,null,x,y);
                                    this.turn=(this.turn+1)%2
                                }
                                rflag=true
                            }
                        }
                    }
                }
            }
        }
        if(rflag&&moveflag)this.setRecord(x,y,mx,my)
        return rflag
    }

    mobilePieceList(){
        var mlist=[]
        for(var i=0;i<this.size[0];i++){
            for(var j=0;j<this.size[1];j++){
                for(var k=0;k<this.size[0];k++){
                    for(var l=0;l<this.size[1];l++){
                        var mflag=this.move(j,i,l,k,false)
                        if(mflag){
                            mlist.push([j,i,l,k])
                        }                       
                    }
                }                
            }
        }
        return mlist
    }

    randSelectMove(){
        var mlist=this.mobilePieceList()
        var slist=mlist[Math.floor(Math.random()*mlist.length)]
        this.move(slist[0],slist[1],slist[2],slist[3],true)
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

    setRecord(x,y,mx,my){
        if(this.SAVE_RECORD){
            var record0={};
            var f_array={}
            for(var i=0;i<this.size[0];i++){
                var f_array0=[];
                for(var j=0;j<this.size[1];j++){
                    var f_array1={};
                    var f0=this.f[i][j]
                    f_array1["type"]=f0.typeStr()
                    f_array1["state"]=f0.state
                    f_array1["turn"]=f0.turn
                    f_array0[j.toString()]=f_array1;
                }
                f_array[i.toString()]=f_array0
            }
            record0["field"]=f_array;
            if(x!=null&&y!=null&&mx!=null&&my!=null){
                var p=this.record[(this.record.length-1)]["field"][y][x]
                var p_array=[];
                p_array["x"]=x;
                p_array["y"]=y;
                p_array["mx"]=mx;
                p_array["my"]=my;
                p_array["piece"]=p
                record0["move"]=p_array;
            }
            record0["win"]=null;
            this.record.push(record0)
        }
    }

    setFinRecord(fin_state){
        if(this.SAVE_RECORD){
            for(var i=0;i<this.record.length;i++){
                this.record[i]["win"]=fin_state
                this.record[i]["fin_length"]=this.record.length
            }
            document.getElementById("output_div").innerHTML=("<div id='output'>"+JSON.stringify(this.record,undefined," ")+"</div>")
        }
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
            [[true,true,true],[true,false,true],[true,true,true]],
            [[true,false,false],[true,false,true],[true,false,false]],
            [[true,true,false],[true,false,true],[true,true,false]],
            [[true,false,true],[true,false,false],[true,false,true]],
            [[false,false,false],[true,false,false],[false,false,false]]
        ]
        if(this.turn==0){
            for(var i=0;i<is_move_array.length;i++){
                is_move_array[i]=arrayRotate(is_move_array[i])
            }
        }
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
            case 5:
                return 'Y'
            case 6:
                return 'X'
            case 7:
                return 'Z'
            case 8:
                return 'E'
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
