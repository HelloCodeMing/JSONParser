var Json = require("../src");
var fs = require("fs");

fs.readFile("./test.json", "utf-8", function(err, data) {
	if (!err) {
		var res = Json.parse(data);
		console.log(res);
	} else {
		console.assert(err);
	}
});

