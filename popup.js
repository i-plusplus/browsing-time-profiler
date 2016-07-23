function extractDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
}

function getCurrentTabSiteName(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    console.log(tab);
    var url = tab.url;
    var domain = extractDomain(url)
    callback(domain);
  });
}

setInterval(function(){
     getCurrentTabSiteName(function(url){
        chrome.storage.sync.get([url], function(item) {
          i = item[url];
	  if(!(url in item)){
		i = 0;
          }
          i = i + 1;
          item[url] = i;
          chrome.windows.getCurrent(function(window){
             if(window.focused == false){
		return;
             }
             chrome.storage.sync.set(item, function() {
		if (chrome.extension.lastError) {
            		alert('An error occurred: ' + chrome.extension.lastError.message);
        	}
             });
          });        
	});
     });
},5000);
      
function sortProperties(obj)
{
    var sortable=[];
    for(var key in obj){
        sortable.push([key, obj[key]]); 
    }
    sortable.sort(function(a, b)
    {
        var x=a[1],y=b[1];
        return x<y ? 1 : x>y ? -1 : 0;
    });
    return sortable;
}

function hide(){
    for(var i = 1;i<21;i++){
	document.getElementById('tr' + i).style.display = "none";
    }	
}

function updateRow(r, site, value){
           document.getElementById('tr' + r).style.display = "";
            if(r%2==0){
           	 document.getElementById('tr' + r).style.backgroundColor = "#F0F8FF";
           }else{
           	 document.getElementById('tr' + r).style.backgroundColor = "#A9A9A9";
           }
           key = 'r' + r + 'c1';
	    var imageResult = document.getElementById(key);
            imageResult.innerHTML = site;
            key = 'r' + r + 'c2';
	    imageResult = document.getElementById(key);
            var hour = Math.floor(parseInt(value)*5/3600);
            var rem = (parseInt(value)*5)%3600;
            var min = Math.floor(parseInt(rem)/60);
            var sec = parseInt(rem)%60;
            imageResult.innerHTML = hour + ':' + min + ':' + sec;
}

function updateValues(){
    hide();
    chrome.storage.sync.get(null, function(item) {
          var r = 1;
          var sum = 0;
          item = sortProperties(item);
          for(r = 0; r< item.length;r++){
               it = item[r];
               if(!isNaN(parseInt(it[1])))
	       sum = sum + parseInt(it[1]);
          }
          var total = sum;
          for(r = 1; r<10 && r < (item.length+1);r++){
            i = item[r-1];
	    updateRow(r, i[0],i[1]);
            sum -= parseInt(i[1]);
          }
        updateRow(r,'misc',sum);
    });
}
function init(){
      resetButton = document.getElementById("resetButton");
      resetButton.onclick = function(){
      	chrome.storage.sync.clear();
      	hide(); 
      };
}
document.addEventListener('DOMContentLoaded',init, false);
document.addEventListener('DOMContentLoaded', updateValues);

