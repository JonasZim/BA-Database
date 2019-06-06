const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function connectToDB(){
    // Connection URL
    const url = 'mongodb://localhost:27017';

    return MongoClient.connect(url, { useNewUrlParser: true })
}

function findStuff(){
    BlogPost.find({}, function(err, doc){
        if(err) console.log(err);
        console.log(doc);
    })
}

function createCrapped(dbName, collectionName){

    connectToDB().then(connection => {

        const db = connection.db(dbName);
        db.createCollection(collectionName, function (err, result) {
            console.log(`Collection ${collectionName} created`);
            connection.close();
        });
    }).catch(err => console.log(err));
}

function insertDocuments(dbName, collectionName, entry){

    connectToDB().then(connection => {

        const db = connection.db(dbName);
        const collection = db.collection(collectionName);

        return collection.insertOne(entry).then(result => {
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted 1 document into the collection");
            console.log(result.ops);
            return result;
        }).catch(err => console.log(err))
            .finally(() => connection.close())
    })
}

function update(dbName, collectionName, entry, matcher){
    connectToDB().then(connection => {

        const db = connection.db(dbName);
        const collection = db.collection(collectionName);

        collection.updateOne(matcher, { $set: entry }, function(err, result) {
            assert.equal(null, err);
            assert.equal(1, result.matchedCount);
            assert.equal(1, result.modifiedCount);
            console.log('One entry updated');
            connection.close();
        })
    }).catch(err => console.log(err));
}

function findEntry(dbName, collectionName, matcher, projection = {}){
    return connectToDB().then(connection => {

        const db = connection.db(dbName);
        const collection = db.collection(collectionName);

        return collection.find(matcher).project(projection).toArray();
    }).catch(err => console.log(err));
}

module.exports = {
    insertDocuments,
    createCrapped,
    update,
    findEntry
};
