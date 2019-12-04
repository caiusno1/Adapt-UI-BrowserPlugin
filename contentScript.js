
// Helpers
function toogleAdaptation(adaptationRule){
    adaptationRule.enabled = (!adaptationRule.enabled);
}
// Adaptations

/*
function dayMode(){
    document.body.style.backgroundColor = "white";
    document.body.style.filter = "invert(0)";
}*/
// Context getter
function getTime(){
    return contextOfUse.environmentContext.time;
}
function getLight(){
    return contextOfUse.environmentContext.light;
}
function getAge(){
    return contextOfUse.userContext.age;
}
function getGender(){
    return contextOfUse.userContext.gender;
}
function getDeviceType(){
    return contextOfUse.platformContext.deviceType;
}

function try2apply(){
    console.log("adaptation cycle");
    for(rule of adaptationRules){
        var apply = false;
        var operant1;
        if(rule.enabled && !rule.active){
            switch(rule.condition.operant1){
                case "time":
                    operant1=getTime();
                    break;
                case "light":
                    operant1=getLight();
                    break;
                case "age":
                    operant1=getAge();
                    break;
                case "gender":
                    operant1=getGender();
                    break;
                case "deviceType":
                    operant1=getDeviceType();
                    break
            }
            switch(rule.condition.operator){
                case "=":
                    if(!isNaN(operant1)){
                        apply=operant1==parseInt(rule.condition.operant2,10);
                    } else {
                        apply=operant1==rule.condition.operant2;
                    }
                    break;
                case ">":
                    apply=operant1>parseInt(rule.condition.operant2,10);
                    break;
                case "<":
                    apply=operant1<parseInt(rule.condition.operant2,10);
                    break;
                case "<=":
                    apply=operant1<=parseInt(rule.condition.operant2,10);
                    break;
                case ">=":
                    apply=operant1>=parseInt(rule.condition.operant2,10);
                    break;
                case "!=":
                    apply=operant1!=parseInt(rule.condition.operant2,10);
                    break;
            }
            if(apply){
                rule.active = true;
                if(rule.action in adaptationOperations)
                {
                    adaptationOperations[rule.action]();
                }
                else if(document.getElementById(rule.action)){
                    document.getElementById(rule.action).click.apply(document.getElementById(rule.action));
                } else {
                    var actionName = rule.action;
                    chrome.storage.sync.get('customOperations', function(data){
                        if(actionName in data.customOperations){
                            var op = data.customOperations[actionName];
                            for(var supOp of op.suboperations){
                                switch(supOp.name){
                                    case "fontSize":
                                        $(supOp.targets).css("font-size",supOp.value);
                                        console.log("execute fontsize");
                                        break;
                                    case "fontColor":
                                        $(supOp.targets).css("color",supOp.value);
                                        console.log("execute fontsize");
                                        break;
                                    case "background":
                                        $(supOp.targets).css("background",supOp.value);
                                        console.log("execute fontsize");
                                        break;
                                }
                            }
                        }
                    });
                }
            }
        }
    }
}
// EnablingFunction
function updateAdaptationStatus(changes, namespace){
    if('adaptations' in changes){
        window.location.reload();
    }
    if('contextOfUse' in changes){
        window.location.reload();
    }
}
// Main method
chrome.storage.onChanged.addListener(updateAdaptationStatus);
chrome.storage.sync.get('adaptations', function(data) {
    console.log("adaptations "+data.adaptations)
    adaptationRules=data.adaptations;
    window.adaptationOperations=adaptationOperations;
    chrome.storage.sync.get('contextOfUse', function(data) {
        console.log("contextOfUse "+data.contextOfUse)
        contextOfUse=data.contextOfUse;
        try2apply();
    });
});

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var gainNode = audioCtx.createGain();
if (navigator.mediaDevices.getUserMedia) {
console.log('getUserMedia supported.');
var constraints = {audio: true}
navigator.mediaDevices.getUserMedia (constraints)
    .then(
    function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(gainNode);
        gainNode.connect(analyser);
        // analyser.connect(audioCtx.destination);
    })
.catch( function(err) { console.log('The following gUM error occured: ' + err);})
} else {
console.log('getUserMedia not supported on your browser!');
}

setInterval(function(){
    var d = new Date();
    var activity = contextOfUse.environmentContext.activity;


    contextOfUse.environmentContext.time = d.getHours()
    contextOfUse.userContext.language =  window.navigator.language;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini|Mobile/.test(navigator.userAgent)){
        contextOfUse.platformContext.deviceType = "mobile";
    }else{
        contextOfUse.platformContext.deviceType = "desktop";
    }
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);
    let avg = 0;
    for (var i = 0; i < bufferLength; i++) {
        avg+=dataArray[i]/128.0;
    }
    avg=avg/bufferLength;
    contextOfUse.environmentContext.noiseLevel=avg*100;
    audioCtx.resume();

    contextOfUse.platformContext.screenWidth = window.innerWidth;
    contextOfUse.platformContext.screenHeight = window.innerHeight;

    


    chrome.storage.sync.set({contextOfUse:contextOfUse});
  },1000*60)

  window.addEventListener ("devicemotion", event => {
    var x = event.acceleration.x;
    var y = event.acceleration.y;
    var z = event.acceleration.z;
    var accelerationAvg = Math.sqrt(x^2+y^2+z^2);

    if( accelerationAvg >= 6){
        contextOfUse.environmentContext.activity=2
        alert("in vehicle");
    }
    else if( accelerationAvg >=3.5) {
        contextOfUse.environmentContext.activity=1;
        alert("on the move");
    }
    else {
        contextOfUse.environmentContext.activity = 0;
    }
});
if ('AmbientLightSensor' in window) {
    const ambientLightSensor = new AmbientLightSensor();
    ambientLightSensor.addEventListener('reading', function(event){
        contextOfUse.environmentContext.light = Math.max(0,Math.min(100,(event.target.illuminance)/11));
    });
    ambientLightSensor.start();
  } else {
    console.log('devicelight event not supported');
}

window.addEventListener('online', function(){
    contextOfUse.environmentContext.online=true;
});
window.addEventListener('offline', function(){
    contextOfUse.environmentContext.online=false;
});
if('getBattery' in navigator){
    navigator.getBattery().then( function(battery){
        battery.addEventListener('chargingchange', function(){
            contextOfUse.platformContext.charging = this.charging;
        });
        contextOfUse.platformContext.charging = battery.charging;
    });
}
var connection = (navigator.connection || navigator.mozConnection ||
    navigator.webkitConnection || navigator.msConnection);
if(connection){
    connection.addEventListener('change', function(connection){
        contextOfUse.platformContext.connectionType = connection.type;
        contextOfUse.platformContext.connectionPerformance = connection.effectiveType;
        contextOfUse.platformContext.mxDownLink = connection.downlinkMax;
    });
    contextOfUse.platformContext.connectionType = connection.type;
    contextOfUse.platformContext.connectionPerformance = connection.effectiveType;
    contextOfUse.platformContext.mxDownLink = connection.downlinkMax;
}
  




