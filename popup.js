// Copyright 2019 Paderborn University. All rights reserved.

'use strict';

function onAdaptationiActivationChange(i){
  return ()=>{
    chrome.storage.sync.get('adaptations', function(data) {
      if(!data.adaptations){
        data.adaptations={};
      }
      if(!(i in data.adaptations)){
        data.adaptations[i]={enabled:false};
      }
      var value = data.adaptations[i].enabled;
      var adaptations = data.adaptations;
      adaptations[i].enabled=!value;
      if(!adaptations[i].enabled){
        adaptations[i].active=false;
      }
      chrome.storage.sync.set({ adaptations: adaptations });
    });
  }
}
function onConditionChange(i){
  chrome.storage.sync.get('adaptations', function(data) {
    if(!data.adaptationStatus){
      data.adaptationStatus={};
    }
    if(!(i in data.adaptationStatus)){
      data.adaptationStatus[i]={enabled:true};
    }
    var condition = {
      "operator":document.getElementById("Adaptation"+(i+1)+"Operator").value,
      "operant1":document.getElementById("Adaptation"+(i+1)+"Property").value,
      "operant2":document.getElementById("Adaptation"+(i+1)+"Value").value
    }
    var adaptationStatus = data.adaptationStatus;
    adaptationStatus[i].enabled=value;
    chrome.storage.sync.set({ adaptationStatus: adaptationStatus });
  });
}

function onContextChange(context){
  chrome.storage.sync.get('contextOfUse', function(data) {
    var value = data.contextOfUse;
    if(value){
      value=true;
    } else {
      value=false;
    }
    chrome.storage.sync.set({ adaptation1Status: value });
  });
}
var adaptationsView = document.getElementById("adaptationViewBody");

var body = document.body;

chrome.storage.sync.get('adaptations', function(data) {
  if(!data.adaptations){
    data.adaptations={};
  }
  var i = 0;
  console.log("load adaptations")
  for(var adaptation of data.adaptations) {
    var adaptationTR = document.createElement("tr");
    var tdcheckbox = document.createElement("td");
    var tdproperty = document.createElement("td");
    var tdoperator = document.createElement("td");
    var tdValue = document.createElement("td");
    var tdMode = document.createElement("td");
    var tdSubmitButton = document.createElement("td");

    var checkbox = document.createElement("input");
    var checkboxtype = document.createAttribute("type");
    checkboxtype.value="checkbox";
    checkbox.setAttributeNode(checkboxtype);
    tdcheckbox.appendChild(checkbox);
    if(adaptation.enabled){
      checkbox.checked = adaptation.enabled;
    }
    checkbox.addEventListener('click',onAdaptationiActivationChange(i));

    var contextPropertyField = document.createElement("input");
    var fieldtype = document.createAttribute("type");
    fieldtype.value="text";
    contextPropertyField.setAttributeNode(fieldtype);
    contextPropertyField.value = adaptation.condition.operant1;
    tdproperty.appendChild(contextPropertyField);

    var operatorField = document.createElement("select");
    var operators = ["=","<=",">=",">","<","!="];
    for(var operator of operators){
      var option=document.createElement('option');
      option.innerHTML = operator;
      option.value = operator;
      if(operator == adaptation.condition.operator){
        var selected = document.createAttribute('selected');
        option.setAttributeNode(selected);
      }
      operatorField.appendChild(option);
    }
    tdoperator.appendChild(operatorField);

    var valueField = document.createElement("input");
    var fieldtype = document.createAttribute("type");
    fieldtype.value="text";
    valueField.setAttributeNode(fieldtype);
    valueField.value = adaptation.condition.operant2;
    tdValue.appendChild(valueField);

    tdMode.innerHTML = adaptation.action;

    var button = document.createElement("button");
    button.innerHTML = "save";
    var eventHandler = (adaptationIndex, valueField, propertyField, operatorField )=> () => {
      chrome.storage.sync.get('adaptations', function(data) {
        data.adaptations[adaptationIndex].condition.operant2 = valueField.value;
        data.adaptations[adaptationIndex].condition.operant1 = propertyField.value;
        data.adaptations[adaptationIndex].condition.operator = operatorField.value;
        console.log("Save adaptation!");
        chrome.storage.sync.set({adaptations:data.adaptations});
      });
    }
    button.addEventListener('click', eventHandler(i, valueField, contextPropertyField, operatorField));

    tdcheckbox.appendChild(checkbox);
    tdproperty.appendChild(contextPropertyField);
    tdoperator.appendChild(operatorField);
    tdValue.appendChild(valueField);
    tdSubmitButton.appendChild(button);


    adaptationTR.appendChild(tdcheckbox);
    adaptationTR.appendChild(tdproperty);
    adaptationTR.appendChild(tdoperator);
    adaptationTR.appendChild(tdValue);
    adaptationTR.appendChild(tdMode);
    adaptationTR.appendChild(tdSubmitButton);

    adaptationsView.appendChild(adaptationTR);
    i++;
  }

  var nightTestButton = document.getElementById('nightTest');
  nightTestButton.addEventListener('click',()=>{
    chrome.storage.sync.get('contextOfUse', function(data) {
      if(data.contextOfUse.environmentContext.time <=20){
        data.contextOfUse.environmentContext.time = 21;
      } else {
        data.contextOfUse.environmentContext.time = 18;
      }
      chrome.storage.sync.set({contextOfUse:data.contextOfUse});
    });
  });
});
var lightTest = document.getElementById('lightTest');
lightTest.addEventListener('click',()=>{
    chrome.storage.sync.get('contextOfUse', function(data) {
      if(data.contextOfUse.environmentContext.light <=50){
        data.contextOfUse.environmentContext.light = 60;
      } else {
        data.contextOfUse.environmentContext.light = 30;
      }
      chrome.storage.sync.set({contextOfUse:data.contextOfUse});
    });
});
var pullPageIdsBt = document.getElementById('pagePull');
pullPageIdsBt.addEventListener('click',()=>{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: `
        Array.from(document.querySelectorAll('*[id]:not([id=""])')).map(x => ""+x.id)
        `}, function(result){
          chrome.storage.sync.set({idsOfCP:result});
        });
  });
});
