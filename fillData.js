/*
fillData.js
Author: Andreas Moe
Date: 4/22/2020
Assignment: Comp20 - 13
Purpose: Populates a Mongo collection with data
*/

var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Mongo:MongoPassword@cluster0-nqsbw.mongodb.net/test?retryWrites=true&w=majority";

function addEntries() {
    // Get data from file and parse to correct format
    var mydata = fs.readFileSync('./data.csv', 'utf8');
    var parseData = mydata.split('\n');
    var temp = parseData.toString();
    parseData = temp.split(',');

    // Connect to Mongo
    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
        if (err) {
            return console.log("Didn't connect to Mongo: " + err);
        }
        
        var database = db.db("Assignment13");
        var collection = database.collection("companies");

        // Fill collection
        for (i = 2; i < parseData.length; i+=2) {
            j = i + 1;
            name = parseData[i];
            temp = parseData[j];
            ticker = temp.slice(0, temp.lastIndexOf(' '));

            entry = {"company": name, "ticker": ticker};
            
            collection.insertOne(entry, function(err, res) {
                if (err) {
                    return console.log("Didn't insert: " + err);
                }
            })
        }
    })
}
addEntries();