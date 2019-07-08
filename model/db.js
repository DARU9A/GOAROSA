const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'GOAROSA';

var data;

exports.connectDB = function(){
    var dbURL = 'mongodb://localhost:27017'
    MongoClient.connect(dbURL, {useNewUrlParser: true}, function(err, client){
        if(err){
            console.log('접속 실패');
            return;
        }
        console.log('접속 성공');
        data = client.db(dbName);
    });
}

exports.teacherRegister = function(name, pw, subject, department, chargeClass, callback){
    var users = data.collection('teachers');

    users.insertMany([{"name": name, "pw": pw, "subject": subject, "department": department, "chargeClass": chargeClass}],
    function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        if(result.insertedCount > 0){
            console.log('사용자 추가됨 ' + result.insertedCount);
            callback(null, result);
        }
        else{
            console.log('사용자 추가 안됨: ' + result.insertedCount);
            callback(null, null);
        }
    });
}