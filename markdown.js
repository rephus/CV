module.exports = {
  parse: function parse(lines){
      var json = {},
          nodes = [],
          lastKey = json;
          
      for (i in lines){
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
              console.log("Unable to jsonify "+line);
          }
      }
      return json;
  }
};

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
    //line = line.replace(/\(/g, "");
    //line = line.replace(/\)/g, "");
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