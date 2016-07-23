function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function getCurrentTabUrl(callback) {
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

     getCurrentTabUrl(function(url){
        
        chrome.storage.sync.get([url], function(item) {
          i = item[url];
	  if(!(url in item)){
                console.log('insidei ' + i);
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
                chrome.storage.sync.get([url], function(item) {
                  j = item[url];
                });
            });
          });        
	});
        
     });

},5000);
      
function sortProperties(obj)
{
  // convert object into array
    var sortable=[];
    for(var key in obj)
        sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
        var x=a[1],y=b[1];
        return x<y ? 1 : x>y ? -1 : 0;
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function hide(){

	for(var i = 1;i<21;i++){
		document.getElementById('tr' + i).style.visibility = "hidden";
	}	

}

function updateValues(){

hide();

chrome.storage.sync.get(null, function(item) {
          var r = 1;
          var sum = 0;
          item = sortProperties(item);
          for(r = 0; r< item.length;r++){
               it = item[r];
               //alert(parseInt(it[1]));
               if(!isNaN(parseInt(it[1])))
	       sum = sum + parseInt(it[1]);
          }
          var total = sum;
          for(r = 1; r<10 && r < (item.length+1);r++){
            i = item[r-1];
            document.getElementById('tr' + r).style.visibility = "visible";
            key = 'r' + r + 'c1';
	    var imageResult = document.getElementById(key);
            imageResult.innerHTML = i[0];
            key = 'r' + r + 'c2';
	    imageResult = document.getElementById(key);
            var hour = Math.floor(parseInt(i[1])*5/3600);
            var rem = (parseInt(i[1])*5)%3600;
            var min = Math.floor(parseInt(rem)/60);
            var sec = parseInt(rem)%60;
            imageResult.innerHTML = hour + ':' + min + ':' + sec;
            sum -= parseInt(i[1]);
          }
          document.getElementById('tr' + r).style.visibility = "visible";
          var imageResult = document.getElementById('r' + r + 'c1');
          imageResult.innerHTML = 'misc';
            
	    imageResult = document.getElementById('r' + r + 'c2');
            imageResult.innerHTML = sum;
	});


}

document.addEventListener('DOMContentLoaded', function() {
      resetButton = document.getElementById("resetButton");
      resetButton.onclick = function(){
         chrome.storage.sync.clear();
	 hide();
      };
      updateValues();
});

