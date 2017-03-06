var fs = require("fs");

if (process.argv.length < 4) {
  console.error("Missing argument, usage: "+
    "node  markdown.js INPUT_FILE OUTPUT_FILE");
  return;
}
var INPUT_FILE = process.argv[2];
var OUTPUT_FILE = process.argv[3];

function parse(lines){

      var json = {};
      var nodes = [];
      var lastKey = json;

      for (var i=0; i < lines.length; i++){
          try{
              var line = lines[i];
              if (isTitle2(line) ){
                  nodes[0] = string2Key(line);
                  json[nodes[0]] = {};
              } else if (isTitle3(line) ) {
                  nodes[1] = string2Key(line);
                  json[nodes[0]][nodes[1]] = {};
              } else if (isTitle4(line) ) {
                  nodes[2] = string2Key(line);
                  json[nodes[0]][nodes[1]][nodes[2]] = {};
              }  else if (isList(line) ){

                  initArray(json,nodes);
                  line = line.replace("*","").trim(); //remove list markers
                  line = fixUrl(line);
                  getJson(json,nodes).push(line);

              } else if (hasKey(line)) {
                  var key = getKey(line);
                  getJson(json,nodes)[key] = fixUrl(getValue(line));
              }
          } catch (e){
              console.log("Unable to jsonify on line "+i+": "+line);
          }
      }
      return json;
}

var writeJsonToFile = function(content, output){

  var text = JSON.stringify(content,null, 4);

  fs.writeFile(output, text, function(err) {
      if(err) {
          console.log(err);
      } else {
          //console.log("The file was saved! "+ output);
      }
  });
};

var mardownToJson = function(inputfile, outputfile) {

  var input = fs.createReadStream(inputfile);

  var remaining = '';
  var lines = [];

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            lines.push(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (remaining.length > 0) lines.push(remaining);

        var json = parse(lines);
        writeJsonToFile(json, outputfile);
    });

};

mardownToJson(INPUT_FILE, OUTPUT_FILE);

var initArray = function initArray(json,nodes){
    if (!getJson(json,nodes).length) {
      for (var i=nodes.length; i>=0;i--){ //cannot use getJson here
            try{
                if (i==2 && json[nodes[0]][nodes[1]][nodes[2]]) {
                    json[nodes[0]][nodes[1]][nodes[2]] = [];
                    break;
                }
                else if (i==1 && json[nodes[0]][nodes[1]]) {
                    json[nodes[0]][nodes[1]] = [];
                    break;
                }
                else if (i==0 && json[nodes[0]]) json[nodes[0]] = [];
            } catch (e){}
        }
    }
}
var getJson = function getJson(json, nodes){
    for (var i=nodes.length; i>=0;i--){
        try{
            if (i==2 && json[nodes[0]][nodes[1]][nodes[2]]) return json[nodes[0]][nodes[1]][nodes[2]];
            else if (i==1 && json[nodes[0]][nodes[1]]) return json[nodes[0]][nodes[1]];
            else if (i==0 && json[nodes[0]]) return json[nodes[0]];
        } catch (e){}
    }
}

var isTitle2 = function isTitle2(line){
  return line.indexOf("## ") == 0;
}
var isTitle3 = function isTitle3(line){
  return line.indexOf("### ") ==0;
}
var isTitle4 = function isTitle4(line){
  return line.indexOf("#### ") ==0;
}

var isList = function isList(line){
    return line.indexOf("* ") != -1;
}

var hasKey = function hasKey(line){
    return line.indexOf(":") != -1;
}

var getKey= function getKey(line){
    var key = line.split(/:(.+)?/)[0].trim();
    return string2Key(key);
}
var getValue = function getValue(line){
    var key = line.split(/:(.+)?/)[1].trim();
    return key.trim();
}

var fixUrl= function fixUrl(line){
    line = line.replace(/\[(.*)\]/g, "");
    line = line.replace(/\(/g, "");
    line = line.replace(/\)/g, "");
    return line;
}

var string2Key = function string2Key (line){
    line = line.toLowerCase();
    line = line.replace(/\#/g, "");
    line = line.replace(/\*/g, "");
    line = line.replace(/\./g, "");
    line = line.replace(/\((.*)\)/g, "");
    line = line.trim();
    line = line.replace(/\s/g, "-");
    return line;
}
var getList= function getList(lines, start){
    var array = [];
    var finished = false;
    var i = 0;
    while (!finished) {
      var line = lines[+i + +start];
      //console.log("list line "+line);
      if (line && isList(line) ) array[i] = line.replace("*","").trim();
      else finished = true;
      i++;
    }
    return array;
}
