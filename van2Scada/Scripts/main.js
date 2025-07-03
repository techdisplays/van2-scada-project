myscada=require('./myscada');
myscada.init();


//process data sent from the view script
//in view script, please, use function myscada.sendDataToServerSideScript
myscada.dataFromViewScripts = function (data,callback)
{
	//process data

	//return value back to view script
	//you must always return a value even empty
	callback("return value");
};

//process data sent from the view script with user authentication
//in view script, please, use function myscada.sendDataToServerSideScriptAuthenticated
myscada.dataFromViewScriptsAuthenticated = function (data,callback)
{
	//process data

	//return value back to view script
	//you must always return a value even empty
	callback("return value");
};


//Uncomment if you wish to receive finish event. This can happen during project download, etc.
/* 
myscada.exitHandler=function (){
//do the cleanup here a then exit
process.exit(1);
}
*/