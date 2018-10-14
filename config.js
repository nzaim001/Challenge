var fs = require("fs");

exports.configContent = function () {
  var config = fs.readFileSync(__dirname+'/config.json');
  var configContent = JSON.parse(config);
  return configContent;
};
