var http = require('http');
var sh = require('shelljs');

//Lets define a port we want to listen to
const PORT=8080;

var startOutputStr = "::startoutput::";
var endOutputStr = "::endoutput::";
var executionStr = "";
var execution_script_name = "run_afib_cardio24.sh";
var runtime = "/usr/local/MATLAB/MATLAB_Compiler_Runtime/v717";

//We need a function which handles requests and send response
function handleRequest(request, response){

    var shellArgs = "";
    shellArgs = shellArgs.concat(request.files.ecg_data);
    executionStr = execution_script_name + " " + runtime + " " + shellArgs;

    var output = sh.exec(executionStr, {silent:true}).output;

    var desired_output = output.split(startOutputStr)[1].split(endOutputStr)[0];
    var outputJSON = JSON.parse(desired_output);

    response.end(outputJSON);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
