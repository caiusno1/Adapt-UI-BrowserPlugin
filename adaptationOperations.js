function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}
function setCookie(cname, cvalue, exdays) {
var d = new Date();
d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
var expires = "expires="+d.toUTCString();
document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
    }
}
return "";
}

function checkCookie() {
var user = getCookie("username");
if (user != "") {
    alert("Welcome again " + user);
} else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
    setCookie("username", user, 365);
    }
}
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
        readOutBtn.innerText="read out";
        readOutBtn.style = "margin-left: 10vw; background-color: lightgray;";
        console.log("enable speach option");
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
        var stopreadOutBtn = document.createElement("button"); 
        stopreadOutBtn.innerText="stop read out";
        stopreadOutBtn.style = "margin-left: 10vw; background-color: lightgray;";
        console.log("enable speach option");
        stopreadOutBtn.addEventListener("click",() => {
            if( 'speechSynthesis' in window){
                const synth =  (window).speechSynthesis;
                synth.cancel();
            } else{
                alert('Read is not supportet in your browser');
            }
        });
        document.body.prepend(readOutBtn);
        document.body.prepend(stopreadOutBtn);
    },
    "navGrid":function navGrid(){
        var navigation = $("nav");
        if(navigation.length > 0){
            var divNavBox = document.createElement("div");
            var lis =  navigation.find("li");
            lis.css("background","blue");
            lis.css("border","1px solid gray");
            lis.find("a").css("color","white");
            lis.find("a").click(()=>{
                setCookie("adapt-navigation","false");
            });
            var navGrid = document.createElement("ul");
            navGrid.style = 
                `
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                list-style-type: none;
                `
            $(navGrid).append(lis);
            divNavBox.appendChild(navGrid);
            var divContent = document.createElement("div");
            $(divContent).append(document.body.childNodes);
            var btn = document.createElement("button");
            btn.addEventListener("click", function(){
                setCookie("adapt-navigation","true");
                window.location.reload();
            });
            btn.innerText = "Back";
            navigation.first().append(btn);
            if(getCookie("adapt-navigation") == "false"){
                document.body.appendChild(divContent);
            } else {
                document.body.appendChild(divNavBox);
            }    
            console.log("test");  
        }
    }
}