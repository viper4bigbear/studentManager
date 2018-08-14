const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
// Connection URL
const url = 'mongodb://127.0.0.1:27017'

// Database Name
const dbName = 'manager'

module.exports = {
  find (collectionName, obj, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      db.collection(collectionName).find(obj).toArray((err, results) => {
        if (err) throw err
        client.close()
        callback(results)
      })
    })
  },
  insertOne (collectionName, obj, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      db.collection(collectionName).insertOne(obj, (err, results) => {
        if (err) throw err
        callback(results.result)
      })
    })
  },
  deleteOne (collectionName, obj, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      db.collection(collectionName).deleteOne(obj, (err, results) => {
        if (err) throw err
        callback(results.result)
      })
    })
  },
  updateOne (collectionName, obj, updateobj, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      db.collection(collectionName).updateOne(obj, {$set: updateobj}, (err, results) => {
        if (err) throw err
        callback(results.result)
      })
    })
  },
  tips (res, str, url) {
    res.send(`<script>alert('${str}');location.href='${url}'</script>`)
  },
  ObjectId
}
