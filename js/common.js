/**
**/

var obj = [];

setInterval(function(){
    try{
    	
    	$.post('http://10.10.1.67:8080/net/index.php/app',obj,function(result) {
    		
    		if (result) {
    			var results = eval("(" + result + ")");
                
                if(results.retCode == "3" ) {
                	window.location.href = "http://10.10.1.67:8080/net/index.php/login";
                }
    		}
            
});
    	
    }catch(e){}
},5000);

