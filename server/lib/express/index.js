const app = require('express')()
const server = require('http').Server(app)
const cors = require('cors')
app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8082"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);

  next()
});

server.listen(3001, function() {
  console.log((new Date()) + ' Server is listening on port 3001')
})

module.exports = app