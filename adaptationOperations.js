var adaptationOperations = {
    "nightMode":
    function nightMode(){
        document.body.style.backgroundColor = "black";
        var cards = document.querySelector(".card:not(:empty), .mnr-c:not(:empty)");
        if(cards){
            card.style.backgroundColor = "black";
        }
        document.body.style.filter = "invert(100%)";
        for(var img of document.getElementsByTagName("img")){
          img.style.filter = "invert(1)";
        }
    },
    "highAmbientLight":
    function highAmbientLight(){
        document.body.style.filter = "contrast(50%)";
    },
    "lowAmbientLight":
    function highAmbientLight(){
        document.body.style.filter = "contrast(200%)";
    },
    "greaterFontSize":
    function highAmbientLight(){
        for(var p of document.getElementsByTagName("p")){
            if(p.style.fontSize<20) {
                p.style.fontSize=Math.max(25,p.style.fontSize*2)+"px";
            }
          }
    },
    "blackWhiteMode":
    function blackWhiteMode(){
        document.body.style.filter = "grayscale(1)";
    }
}