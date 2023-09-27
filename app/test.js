console.log("env:", process.env);

var request = require("request");

request({
  "url": "https://misteraladin.com",
  "method": "GET",
}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  } else {
    console.log(error);
  }
});
