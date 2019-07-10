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

//선생님 회원가입
exports.teacherRegister = function(name, password, subject, department, classroom, callback){
    var users = data.collection('teacher');
    users.findOne({"name": name}, function(err, result){
        if(err) console.log('ERROR!');
        else console.log('OK!');
        check = result;
        if(check){
            callback(null, null);
        }
        else{
            users.insertMany([{"name": name, "password": password, "subject": subject, "department": department, "classroom": classroom}],
                function(err, result){
                    if(err){
                        callback(err, null);
                        return;
                    }
                    if(result.insertedCount > 0){
                        console.log('선생님 추가 완료 ' + result.insertedCount);
                        callback(null, result);
                    }
                    else{
                        console.log('선생님 추가 실패 ' + result.insertedCount);
                        callback(null, null);
                    }
                }
            );
        }
    });
}

//학생 회원가입
exports.studentRegister = function(name, password, classroom, callback){
    var users = data.collection('student');
    users.findOne({"name": name}, function(err, result){
        if(err) console.log('ERROR!');
        else console.log('OK!');
        check = result;
        if(check){
            callback(null, null);
        }
        else{
            users.insertMany([{"name": name, "password": password, "classroom": classroom}],
            function(err, result){
                if(err){
                    callback(err, null);
                }
                if(result.insertedCount > 0){
                    console.log('학생 추가 완료 ' + result.insertedCount);
                    callback(null, result);
                }
                else{
                    console.log('학생 추가 실패 ' + result.insertedCount);
                    callback(null, null);
                }
            });
        }
    });
}

//사용자 확인(로그인)
exports.existCheck = function(identity, name, callback){
    var users = data.collection(identity);
    var loadedUser;
    var check;
    users.findOne({"name": name}, function(err, result){
        if(err) console.log('ERROR!');
        else console.log('OK!');
        check = result;
        if(check){
            loadedUser = users.find({"name": name});
            loadedUser.toArray(
                function(err, result){
                    if(err){
                        callback(err, null);
                    }
                    if(result.length > 0){
                        callback(null, result);
                    }
                    else{
                        callback(null, null);
                    }
                }
            )
        }
        else{
            callback(null, null);
        }
    });
}

//메일 박스에 저장
exports.sendMail = function(to, from, title, content, callback){
    var users = data.collection('mailbox');
    users.insertMany([{"to": to, "from": from, "title": title, "content": content}],
    function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        if(result.insertedCount > 0){
            console.log('메일 전송 완료 ' + result.insertedCount);
            callback(null, result);
        }
        else{
            console.log('메일 전송 실패 ' + result.insertedCount);
            callback(null, null);
        }
    });
}

//발신함
exports.outbox = function(from, callback){
    var mails = data.collection('mailbox');
    var loadedMail;
    var check;
    mails.findOne({"from": from}, function(err, result){
        if(err) console.log('ERROR!');
        else console.log('OK!');
        check = result;
        if(check){
            loadedMail = mails.find({"from": from});
            loadedMail.toArray(
                function(err, result){
                    if(err){
                        callback(err, null);
                    }
                    if(result.length > 0){
                        callback(null, result);
                    }
                    else{
                        callback(null, null);
                    }
                }
            )
        }
        else{
            callback(null, null);
        }
    });
}

//수신함
exports.inbox = function(to, callback){
    var mails = data.collection('mailbox');
    var loadedMail;
    var check;
    mails.findOne({"to": to}, function(err, result){
        if(err) console.log('ERROR!');
        else console.log('OK!');
        check = result;
        if(check){
            loadedMail = mails.find({"to": to});
            loadedMail.toArray(
                function(err, result){
                    if(err){
                        callback(err, null);
                    }
                    if(result.length > 0){
                        callback(null, result);
                    }
                    else{
                        callback(null, null);
                    }
                }
            )
        }
        else{
            callback(null, null);
        }
    });
}

//공지사항, 과제 게시판 포스트
exports.post = function(identity, classroom, content, callback){
    var users = data.collection('board');
    users.insertMany([{"identity": identity, "classroom": classroom, "content": content}],
    function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        if(result.insertedCount > 0){
            console.log('포스트 완료 ' + result.insertedCount);
            callback(null, result);
        }
        else{
            console.log('포스트 실패 ' + result.insertedCount);
            callback(null, null);
        }
    });
}

//공지사항, 과제 게시판 불러오기
exports.board = function(classroom, callback){
    var posts = data.collection('board');
    var loadedPost;
    var check;
    posts.findOne({"classroom": classroom}, function(err, result){
        if(err) console.log('ERROR!');
        else console.log('OK!');
        check = result;
        if(check){
            loadedPost = posts.find({"classroom": classroom});
            loadedPost.toArray(
                function(err, result){
                    if(err){
                        callback(err, null);
                    }
                    if(result.length > 0){
                        callback(null, result);
                    }
                    else{
                        callback(null, null);
                    }
                }
            )
        }
        else{
            callback(null, null);
        }
    });
}