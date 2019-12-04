function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}
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
    },
    "modalityChange":
    function blackWhiteMode(){
        var readOutBtn = document.createElement("button"); 
        readOutBtn.innerText="read out"
        readOutBtn.addEventListener("click",() => {
            if( 'speechSynthesis' in window){
                const synth =  (window).speechSynthesis;
                const content  = document.body;
                const allTextNodes=textNodesUnder(content);
                const utterThis = new SpeechSynthesisUtterance(
                allTextNodes.map((textnode)=>
                    textnode.textContent ? textnode.textContent : textnode.innerText)
                );
                synth.speak(utterThis);
            } else{
                alert('Read is not supportet in your browser');
            }
        });
        document.body.appendChild(readOutBtn);
    }
}