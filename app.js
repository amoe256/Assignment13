var http = require('http');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb+srv://Mongo:MongoPassword@cluster0-nqsbw.mongodb.net/test?retryWrites=true&w=majority";

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    
    var queryData = url.parse(req.url, true).query;
    if (req.method == "GET") {
        MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {
            if (err) {
                return console.log("Error connecting to db: " + err);
            }
            var dbo = db.db("Assignment13");
            var coll = dbo.collection("companies");
            result = coll.find().toArray(function(err, items) {
                if (err)
                    return console.log(err);
                if (queryData.company) {
                    result = findQuery(items, queryData.company);
                    res.write("The ticker for " + queryData.company + " is " + result, function() {res.end()});
                }
                else {
                    result = findQuery(items, queryData.ticker);
                    res.write("The company for " + queryData.ticker + " is " + result, function() {res.end()});    
                }
            });
        })
    }
}).listen(8080);

function findQuery(items, query) 
{
    for (i = 0; i < items.length; i++) {
        console.log("company: " + items[i].company);
        console.log("ticker: " + items[i].ticker);
        if (items[i].company == query) {
            return items[i].ticker;
        }
        else if (items[i].ticker == query) {
            return items[i].company;
        }
    }
}