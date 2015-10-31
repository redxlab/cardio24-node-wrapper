var http = require('http');
var sh = require('shelljs');
var path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');
var express = require('express');
var app = express();

//Lets define a port we want to listen to
const PORT=8080;

var startOutputStr = "::startoutput::";
var endOutputStr = "::endoutput::";
var executionStr = "";
var execution_script_name = "./lib/run_afib_cardio24.sh";
var runtime = "/usr/local/MATLAB/MATLAB_Compiler_Runtime/v717";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({
  dest: path.join(__dirname, 'uploads'),

  onFileUploadStart: function (file, req, res) {
    console.log(file.fieldname + ' is starting ...')
  },

  onFileUploadComplete: function (file, req, res) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
}));

app.post('/', function (req, res) {
  var shellArgs = "";
  shellArgs = shellArgs.concat(req.files.ecg_data.path);
  executionStr = execution_script_name + " " + runtime + " " + shellArgs + " 250";

  var output = sh.exec(executionStr, {silent:true}).output;

  var desired_output = output.split(startOutputStr)[1].split(endOutputStr)[0];
  //var outputJSON = JSON.parse(desired_output);
  res.end(desired_output);

});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
