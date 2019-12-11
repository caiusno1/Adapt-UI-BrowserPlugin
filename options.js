// Copyright 2019 Paderborn University. All rights reserved.

'use strict';

function init() {

  if(isMobile()) {
    var head = document.getElementsByTagName('head')[0];
    var js2 = document.createElement("script");
  
    js2.type = "text/javascript";
    js2.src = "/libs/jquery.mobile/jquery.mobile-1.4.5.min.js"
    head.appendChild(js2);
  }
}


function isMobile() {

  if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/IEMobile/i))
  {
    return true;
  }
  return false;
}

init();
$(document).ready(function(){
  if(isMobile()){
    $("#customAdaptationPanel").hide();
  } else {
    $( ".dragableOp" ).draggable({ revert: true });
    $( ".dropableOp" ).droppable({
      accept: ".dragableOp",
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function( event, ui ) {
        var container = $("<p class='subOperationContainer'></p>")
        $(event.target).append(container)
        container.append($("<p class='supOperationName'>"+ui.draggable[0].innerText+"(</p><p class='dropableID' style='padding-top:5px'></p>,<input type='text'/>)"));
        $( ".dropableID" ).droppable({
          accept: ".dragableID",
          classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
          },
          drop: function( event, ui ) {
            console.log(ui.draggable[0].innerText);
            $(event.target).append($("<div class='uiIdentifier'>"+ui.draggable[0].innerText+"</div>"));
          }
        });
      }
    });
    chrome.storage.sync.get('idsOfCP', function(data) {
      var idList=$("#idList");
      var i = 0;
      if(data.idsOfCP) {
        for(var id of data.idsOfCP[0]){
          console.log(id);
          idList.append($("<li class='dragableID' style='list-style:none;'>"+id+"</li>"));
          i++;
        }
        $( ".dragableID" ).draggable({ revert: true });
      }
    });
    $("#saveButton").click(function(){
      console.log("saveAction");
      var customOperation = {name:$("#operationName")[0].value};
      var suboperations=$("#suboperationArea .subOperationContainer");
      customOperation.suboperations=[];
      for(var suboperation of suboperations){
        var suboperationItem={name:$(suboperation).find(".supOperationName")[0].innerText.slice(0,-1), targets: "", value:"" }
        customOperation.suboperations.push(suboperationItem);
        suboperationItem.targets=$(suboperation).find(".uiIdentifier").get().map(x => "#"+x.innerText).join(",")
        suboperationItem.value = $(suboperation).find("input")[0].value;
      }
      chrome.storage.sync.get('customOperations', function(data){
        if(!data.customOperations){
          data.customOperations={};
        }
        data.customOperations[customOperation.name]=customOperation;
        chrome.storage.sync.set({customOperations:data.customOperations});
      });
    });
    $("#adaptationAddBt").click(function(){
      chrome.storage.sync.get('adaptations', function(data) {
        data.adaptations=data.adaptations.filter(ele => ele.name!=$("#adaptationName")[0].value)
        data.adaptations.push({
          name:$("#adaptationName")[0].value,
          enabled: false,
          active: false,
          action: $("#adaptopName")[0].value,
          condition:
          {
              "operator":"<",
              "operant1":"time",
              "operant2":"20"
          },
        });
        chrome.storage.sync.set({adaptations:data.adaptations});
      });
    });
  }
  $("#saveUserData").click(function(){
    chrome.storage.sync.get('contextOfUse', function(data) {
      data.contextOfUse.userContext.age=parseInt($('#userAge')[0].value,10);
      data.contextOfUse.userContext.gender=$('#userGender')[0].value;
      data.contextOfUse.userContext.colorBlindness = $("#colorBlindness").val();
      chrome.storage.sync.set({contextOfUse:data.contextOfUse});
    });
  });
 
});