var express = require("express"),
    fs = require("fs"),
    app = express(),
    markdown = require("./markdown");

app.use(express.static(__dirname + '/public'));

app.get('/json',  function(req,res){
 
  var input = fs.createReadStream('cv.md'),
      remaining = '',
      lines = [];
      
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
    var json = markdown.parse(lines);
    res.json(json);
  });
  
}); 


var port = 5000;
app.listen(process.env.PORT || port, function() {
  console.log("Listening on " + port);
});
