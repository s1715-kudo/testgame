function gamestart() {
    var rand = document.getElementsByName("rand");
    var url="game.html"
    if(rand[0].checked||rand[1].checked){
        url+=("?1p="+rand[0].checked+"&2p="+rand[1].checked)
    }
    window.location.href = url;
}