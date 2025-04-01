const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');

const TOKEN_KEY = "secretKey";

const authenticateToken=(req, res, next) =>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvv");
  console.log(token);
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    console.log(user);
    let query = "SELECT * FROM users WHERE id=(?)"
    connection.query(query,[user.id],(err,result)=>{
      if (err) {
        return res.sendStatus(403);
      }
      user.isMod = result[0]?result[0].isMod:0;
      req.user = user;
      next();
    })
  });
}

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "admin"
});

const app = express();

app.use(express.json());
app.use(require("cors")());

try {
  connection.connect();
  console.log("mysql connected");
} catch (err) {
  console.log(err);
}

app.get('/', (req, res, next) => {
  res.sendFile('/usr/src/app/index.html');
})
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());



function InitDB (){
  let createPostDB = "CREATE DATABASE postdb";
    connection.query(createPostDB, (err, result) => {
      if (err) throw err;
      console.log(result);
      console.log("Database postdb created.");
    UsePostDB();
    let createUserTable = "CREATE TABLE users(id int AUTO_INCREMENT NOT NULL, uName VARCHAR(64) NOT NULL, uPass VARCHAR(64) NOT NULL, isMod int NOT NULL, PRIMARY KEY (id))"; //isMod 0 for standard user, 1 for moderator/admin
    connection.query(createUserTable, (err, result) => {
      if (err) throw err;
      console.log(result);
      console.log("Table users created.");
      let createAdmin = `INSERT INTO users (uName, uPass, isMod) VALUES (?, ?, ?)`; //Static base user - moderator
    let uName = "Moderator";
    let uPass = "SomethingTypable";
    let isMod = 1;
    connection.query(createAdmin, [uName, uPass, isMod], function (err,result) {
      if (err){
        console.log("********insert************");
        console.log(err);
        return
      }
      return console.log("Admin user created, Moderator/SomethingTypable");
      });
    });
    let createChannelTable = "CREATE TABLE channel(id int AUTO_INCREMENT NOT NULL, channelName VARCHAR(255) NOT NULL, description VARCHAR(255), PRIMARY KEY (id))";
        connection.query(createChannelTable, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table channel created.");
        });
    let createPostsTable = "CREATE TABLE posts(id int AUTO_INCREMENT NOT NULL, timeStamp datetime default CURRENT_TIMESTAMP, topic VARCHAR(255) NOT NULL, data VARCHAR(255) NOT NULL, VotePost INT, uID INT NOT NULL, uName VARCHAR(255) NOT NULL, channelID INT NOT NULL, PRIMARY KEY (id))";
        connection.query(createPostsTable, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table posts created.");
        });
        let createReplyTable = "CREATE TABLE reply(id int AUTO_INCREMENT NOT NULL, timeStamp datetime default CURRENT_TIMESTAMP, data VARCHAR(255) NOT NULL, VoteReply INT, parentID INT NOT NULL, uID INT NOT NULL, uName VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
        connection.query(createReplyTable, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table Reply created.");
        });
        let createVotePost = "CREATE TABLE VotePost(id int AUTO_INCREMENT NOT NULL, timeStamp datetime default CURRENT_TIMESTAMP, parentID INT NOT NULL, uID INT NOT NULL, direction INT NOT NULL, PRIMARY KEY (id))";//direction 1 = upvote, direction -1 = downvote
        connection.query(createUpVotePost, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table Upvote for posts created.");
        });
        let createVoteReply = "CREATE TABLE VoteReply(id int AUTO_INCREMENT NOT NULL, timeStamp datetime default CURRENT_TIMESTAMP, parentID INT NOT NULL, uID INT NOT NULL, direction INT NOT NULL, PRIMARY KEY (id))";//direction 1 = upvote, -1 = downvote
        connection.query(createVoteReply, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table for reply votes created.");
        });
})}

function UsePostDB(){
  let useDBSql = "USE postdb";
  connection.query(useDBSql, (err, result) => {
    if (err) throw err;
      console.log(result);
    });  
}

//check vote on post - if a user has already voted on a post
function CheckVP(req, res, next){
  let uId = req.user.id;
  let parentId = req.params.postId;
  let sql = "Select * from VotePost WHERE uID = (?) and parentId = (?)"
  connection.query(sql, [uId,parentId], (err,result) =>{
    if(err) return res.end();
    if(result&&result.length>0) {
        req.alreadyExists = true;
        req.direction=result[0].direction;
    } else {
    req.alreadyExists = false;
    }
    next()
  })

}
//retrieve votes for post
function GetVP(req, res, next){
  let postId = req.params.postId;
  let sql = "Select VotePost from posts WHERE id = (?)"
  console.log("get upvotes")
  connection.query(sql, [postId], (err,result) =>{
    if(err) {
      console.log(err);
      return res.end();
    }
    req.VotePost = result[0].VotePost?result[0].VotePost:0
    next()
  })
}
//check for upvote on reply
function CheckVR(req, res, next){
  let uId = req.user.id;
  let parentId = req.params.replyId;
  let sql = "Select * from VoteReply WHERE uID = (?) and parentId = (?)"

  connection.query(sql, [uId,parentId], (err,result) =>{
    if(err) return res.end();
    if(result&&result.length>0){
      req.alreadyExists = true;
      req.direction=result[0].direction;
    } else {
      req.alreadyExists = false;
    }
    next()
  })

}
//retrieve upvotes for reply
function GetVR(req, res, next){
  let postId = req.params.replyId;
  let sql = "Select VoteReply from reply WHERE id = (?)"
  connection.query(sql, [postId], (err,result) =>{
    if(err) {
      console.log(err);
      return res.end();
    }
    req.VoteReply = result[0].VoteReply?result[0].VoteReply:0
    next()
  })

}

try{
let checkDBSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'postdb'";
  connection.query(checkDBSql, (err, dbResult) => {
    if (err) throw err;
    console.log(dbResult);
  
    if (dbResult.length > 0) {
      let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
      connection.query(checkTableSql, (err, tableResult) => {
      if (err) throw err;
      console.log(tableResult);})
    } else {
      InitDB();
    }
    console.log("Databse postdb found.");
});} catch {
  InitDB();
  UsePostDB();
  console.log("initdb && usepostdb");
}

app.get('/check', (req,res)=>{
  let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
      connection.query(checkTableSql, (err, tableResult) => {
      if (err) throw err;
      console.log(tableResult);
      res.send({exists:tableResult.length>0});
  })
})
/*
app.get('/initialize', (req, res) => {
  let checkDBSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'postdb'";
  connection.query(checkDBSql, (err, dbResult) => {
    if (err) throw err;
    console.log(dbResult);

    if (dbResult.length > 0) {
      let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
      connection.query(checkTableSql, (err, tableResult) => {
        if (err) throw err;
        console.log(tableResult);
      });
    } else {
      InitDB();
    }
  });
});
*/
app.post('/signUp', (req,res) => {
  console.log("**********************");
  console.log(req.body);
  const uName = req.body.username;
  const uPass = req.body.password;
  const isMod = 0;
  UsePostDB();
  var check = 'SELECT * FROM users WHERE uName = (?)';
  connection.query(check, [uName], function (err,result){
    if (err){
      console.log("********connection query************");
      console.log(err);
      return res.send(err.message);
    }
    if (result&&result.length>0){
      return res.send('User already exists');
    }
    var sql = `INSERT INTO users (uName, uPass, isMod) VALUES (?, ?, ?)`;
  
  connection.query(sql, [uName, uPass, isMod], function (err,result) {
    if (err){
      console.log("********insert************");
      console.log(err);
      return res.send(err.message);
    }
    token = jwt.sign(
      { userId: this.lastID, uName:uName},
     TOKEN_KEY,
      { expiresIn: "1h" }
    );
    return res.send({token, status:"done"});
    });
  })
});
app.post('/signIn', (req,res) => {
  const uName = req.body.username;
  const uPass = req.body.password;
  UsePostDB();

  var sql = `SELECT * FROM users WHERE uName = (?) AND uPass = (?)`;
  
  connection.query(sql, [uName, uPass], function (err,result) {
    if (err){
      console.log(err);
      return res.send(err.message);
    }
    if (result&&result.length>0){
      console.log("sign in result:");
      console.log(result[0]);
      let token = jwt.sign(
        { id:result[0].id, uName:uName},
       TOKEN_KEY,
        { expiresIn: "1h" });
        return res.send({token, status:"done"});
    } else {
      return res.send('User/Pass mismatch');
    }
  });
});
app.post('/logout/', (req,res) =>{

});

app.use(authenticateToken)

app.post('/addChannel', (req,res) => {
  const channelName = req.body.channelName;
  const description = req.body.description;
  var sql = `INSERT INTO channel (channelName, description) VALUES
  (?,?)`;
  
  connection.query(sql, [channelName, description], function (err,result) {
  console.log(err); 
  });
  res.send('Channel created'); 
});
app.post('/addPost/:channelId', (req,res) => {
  const topic = req.body.topic;
  const data = req.body.data;
  const uID = req.user.id;
  const uName = req.user.uName;
  const channelID = req.params.channelId;//req.body.channelID;
  
  var sql = `INSERT INTO posts (topic, data, uID, uName, channelID, VotePost) VALUES
  (?, ?, ?, ?, ?, ?)`;
  
  connection.query(sql, [topic, data, uID, uName, channelID, 0], function (err,result) {
  console.log(err); 
  });
  res.send('Post created'); 
});

app.post('/addReply/:parentId', (req,res) => {
  const data = req.body.data;
  const uID = req.user.id;
  const uName = req.user.uName;
  const parentId = req.params.parentId;
  
  var sql = `INSERT INTO reply (data, uID, uName, parentID, VoteReply) VALUES
  (?, ?, ?, ?, ?)`;
  
  connection.query(sql, [data, uID, uName, parentId, 0], function (err,result) {
  console.log(err); 
  });
  res.send('Reply created'); 
});
app.get('/getPosts', (req, res) => {
  let sql = 'SELECT * FROM posts';
  let query = connection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send({result});
  });
});
app.get('/getPosts/:channelId', (req, res) => {
  let channelId = req.params.channelId;
  let sql = 'SELECT * FROM posts WHERE channelId = (?) ORDER BY timeStamp';
  let query = connection.query(sql, [channelId], (err, result) => {
      if(err) throw err;
      console.log(result);
      result=result.map(post=>{
        let newPost=post;
        if(req.user.isMod || req.user.id==post.uID){
          newPost["deletable"]=true
          }else{
            newPost["deletable"]=false
          }
        return newPost
      })
      res.send({result});
    })
});
app.get('/getPost/:postId', (req, res) => {
  let postId = req.params.postId;
  let sql = 'SELECT * FROM posts WHERE id = (?)';
  let query = connection.query(sql, [postId], (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send({result});
  });
});

app.get('/upVotePost/:postId', CheckVP, GetVP, (req,res) => {
  console.log("start upvote")
   
  const postId = req.params.postId;
  let change
  if (req.alreadyExists){
    if (req.direction==1){
        change = -1; //double clicked upvote, remove upvote
        //remove from votepost
    } else {
      change = 2; //was downvoted, remove downvote and add upvote
      //update direction for VotePost table
    }
  }else{
    change = 1;
    //add to votepost
  }
  let upVotes = req.VotePost + change;
  var set = `UPDATE posts SET VotePost = (?) WHERE id = (?)`;
  connection.query(set, [upVotes, postId], function (err,result) {
    console.log(err);
    if (!req.alreadyExists){
    const sql = 'INSERT into VotePost (parentID, uID, direction) VALUES (?,?,?)'
    connection.query(sql, [postId, req.user.id, 1], function (err,result) {
      console.log(err);
    res.send({vote:upVotes,direction:1});})
    }else{
      if (req.direction==1){
      let sql = "Delete from VotePost WHERE uID = (?) and parentId = (?)"
      connection.query(sql, [req.user.id,postId], (err) => {
        if(err) return res.send({vote:upVotes});
        return res.send({vote:upVotes,direction:0});
      })
      }else{
        let sql = "UPDATE VotePost SET direction = (?) WHERE uID = (?) and parentId = (?)"
        connection.query(sql, [1,req.user.id,postId], (err) => {
          if(err) return res.send({vote:upVotes});
          return res.send({vote:upVotes,direction:1});
        })
      }
    }
  });
  
});

app.get('/downVotePost/:postId', CheckVP, GetVP, (req,res) => {
  console.log("start downvote")
   
  const postId = req.params.postId;
  let change
  if (req.alreadyExists){
    if (req.direction==-1){
        change = -1; //double clicked upvote, remove upvote
        //remove from votepost
    } else {
      change = 2; //was downvoted, remove downvote and add upvote
      //update direction for VotePost table
    }
  }else{
    change = 1;
    //add to votepost
  }
  let upVotes = req.VotePost - change;
  var set = `UPDATE posts SET VotePost = (?) WHERE id = (?)`;
  connection.query(set, [upVotes, postId], function (err,result) {
    console.log(err);
    if (!req.alreadyExists){
    const sql = 'INSERT into VotePost (parentID, uID, direction) VALUES (?,?,?)'
    connection.query(sql, [postId, req.user.id, -1], function (err,result) {
      console.log(err);
      res.send({vote:upVotes,direction:-1});})
    }else{
      if (req.direction==-1){
      let sql = "Delete from VotePost WHERE uID = (?) and parentId = (?)"
      connection.query(sql, [req.user.id,postId], (err) => {
        if(err) return res.send({vote:upVotes});
        return res.send({vote:upVotes,direction:0});
      })
      }else{
        let sql = "UPDATE VotePost SET direction = (?) WHERE uID = (?) and parentId = (?)"
        connection.query(sql, [-1,req.user.id,postId], (err) => {
          if(err) return res.send({vote:upVotes});
          return res.send({vote:upVotes,direction:-1});
        })
      }
    }
  });
  
});

app.get('/upVoteReply/:replyId', CheckVR, GetVR, (req,res) => {
  console.log("start upvote")
   
  const replyId = req.params.replyId;
  let change
  if (req.alreadyExists){
    if (req.direction==1){
        change = -1; //double clicked upvote, remove upvote
        //remove from votepost
    } else {
      change = 2; //was downvoted, remove downvote and add upvote
      //update direction for VotePost table
    }
  }else{
    change = 1;
    //add to votepost
  }
  let upVotes = req.VoteReply + change;
  var set = `UPDATE Reply SET VoteReply = (?) WHERE id = (?)`;
  connection.query(set, [upVotes, replyId], function (err,result) {
    console.log(err);
    if (!req.alreadyExists){
    const sql = 'INSERT into VoteReply (parentID, uID, direction) VALUES (?,?,?)'
    connection.query(sql, [replyId, req.user.id, 1], function (err,result) {
      console.log(err);
    res.send({vote:upVotes});})
    }else{
      if (req.direction==1){
      let sql = "Delete from VoteReply WHERE uID = (?) and parentId = (?)"
      connection.query(sql, [req.user.id,replyId], (err) => {
        if(err) return res.send({vote:upVotes});
        return res.send({vote:upVotes});
      })
      }else{
        let sql = "UPDATE VoteReply SET direction = (?) WHERE uID = (?) and parentId = (?)"
        connection.query(sql, [1,req.user.id,replyId], (err) => {
          if(err) return res.send({vote:upVotes});
          return res.send({vote:upVotes});
        })
      }
    }
  });
  
});

app.get('/downVoteReply/:replyId', CheckVR, GetVR, (req,res) => {
  console.log("start downvote")
   
  const replyId = req.params.replyId;
  let change
  if (req.alreadyExists){
    if (req.direction==-1){
        change = -1; //double clicked upvote, remove upvote
        //remove from votepost
    } else {
      change = 2; //was downvoted, remove downvote and add upvote
      //update direction for VotePost table
    }
  }else{
    change = 1;
    //add to votepost
  }
  let upVotes = req.VoteReply - change;
  var set = `UPDATE Reply SET VoteReply = (?) WHERE id = (?)`;
  connection.query(set, [upVotes, replyId], function (err,result) {
    console.log(err);
    if (!req.alreadyExists){
    const sql = 'INSERT into VoteReply (parentID, uID, direction) VALUES (?,?,?)'
    connection.query(sql, [replyId, req.user.id, -1], function (err,result) {
      console.log(err);
    res.send({vote:upVotes});})
    }else{
      if (req.direction==-1){
      let sql = "Delete from VoteReply WHERE uID = (?) and parentId = (?)"
      connection.query(sql, [req.user.id,replyId], (err) => {
        if(err) return res.send({vote:upVotes});
        return res.send({vote:upVotes});
      })
      }else{
        let sql = "UPDATE VoteReply SET direction = (?) WHERE uID = (?) and parentId = (?)"
        connection.query(sql, [-1,req.user.id,replyId], (err) => {
          if(err) return res.send({vote:upVotes});
          return res.send({vote:upVotes});
        })
      }
    }
  });
  
});

app.get('/getReplies/:postId', (req, res) => {
  let parentId = req.params.postId;
  console.log(parentId);
  let sql = 'SELECT * FROM reply WHERE parentId = (?)';
  let query = connection.query(sql, [parentId], (err, result) => {
      if(err) throw err;
      console.log(result);
      result=result.map(reply=>{
        let newReply=reply;
        if(req.user.isMod || req.user.id==reply.uID){
          newReply["deletable"]=true
        }else{
          newReply["deletable"]=false
        }
        return newReply;
      })
      console.log("response out")
      console.log(result);
      res.send({result});
  });
});

app.get('/metaReply/:postId', (req, res) => {
  let parentId = req.params.postId;
  let sql = 'SELECT * FROM reply where parentId = (?)'
  let query = connection.query(sql, [parentId], (err, result) => {
    if(err) throw err;
    console.log(result);
    let arr = result;
    arr.sort((a,b)=>b.VoteReply-a.VoteReply)
    if(arr.length>1){
      return res.send({count:result.length,relevant:arr[0].data});
    }else{
      res.send({count:result.length,relevant:"No replies"});
   } 
  })
})

app.get('/getChannels', (req, res) => {
  let sql = 'SELECT * FROM channel';
  let query = connection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send({result,isMod:req.user.isMod});
  });
});

app.delete('/removeChannel/:channelId', (req,res) =>{
  if(!req.user.isMod){
    return res.status(401)
  }
  let channelId = req.params.channelId;
  let emptyChannel = "DELETE FROM posts WHERE channelID = (?)"
  connection.query(emptyChannel,[channelId], (err,result)=>{
    if (err) {
      return res.sendStatus(501);
    }
    let sql = 'DELETE FROM channel WHERE id = (?)';
    connection.query(sql,[channelId], (err,result)=>{
    if(err) {
      return res.sendStatus(501);
    }
  })
  })
  res.end();
})

const GetPostOwner = (req,res,next) =>{
  const postId=req.params.postId
  let sql = "select * from posts where id = (?)"
  connection.query(sql,[postId],(err,result)=>{
    if(err) throw err;

  req.ownerid=result[0].uID
  next()
  })
}
app.delete('/removePost/:postId',GetPostOwner, (req,res) => {
  
  if(req.user.id==req.ownerid || req.user.isMod){
    let postId = req.params.postId;
    let data = 'Post removed by: ' + req.user.uName;
    let sql = 'UPDATE posts SET data = (?) WHERE id = (?)'
    connection.query(sql,[data,postId], (err,result)=>{
      if(err) {
        console.log(err);
        return res.sendStatus(501);
      }
      res.end();
    })
  }
})

const GetReplyOwner = (req,res,next) =>{
  const postId=req.params.replyId
  let sql = "select * from reply where id = (?)"
  connection.query(sql,[postId],(err,result)=>{
    if(err) throw err;

  req.ownerid=result[0].uID
  next()
  })
}

app.delete('/removeReply/:replyId', GetReplyOwner, (req,res) => {
  if(req.user.id==ownerid||req.user.isMod){
    let replyId = req.params.replyId;
    let data = 'Reply removed by user: ' + req.user.uName;
    let sql = 'UPDATE reply SET data = (?) WHERE id = (?)'
    connection.query(sql,[data,replyId], (err,result)=>{
      if(err) {
        return res.sendStatus(501);
      }
      res.end();
    })
  }
})

const SearchChannel = (req,res,next) =>{
  let string = req.params.string;
  let channels = `SELECT * FROM channel WHERE channelName LIKE ('%${string}%') COLLATE utf8_general_ci or description LIKE ('%${string}%') COLLATE utf8_general_ci`
  let queryChannel = connection.query(channels, (err,result) => {
    if (err) throw err;
    console.log("Channel results");
    console.log(result);
    req.searchChannelResult=result
    next();
  })
}
const SearchPost = (req,res,next) =>{
  let string = req.params.string;
  let posts = `SELECT * FROM posts WHERE data LIKE ('%${string}%') COLLATE utf8_general_ci or topic LIKE ('%${string}%') COLLATE utf8_general_ci`
  let queryPost = connection.query(posts, (err, result) => {
    if(err) throw err;
    console.log("Post results");
    console.log(result);
    req.searchPostResult=result;
    next();
  })
}
const SearchReply = (req,res,next) =>{
  let string = req.params.string;
  let replies = `SELECT * FROM reply WHERE data LIKE ('%${string}%') COLLATE utf8_general_ci`
  let queryReply = connection.query(replies, (err,result) => {
    if (err) throw err;
    console.log("Reply results");
    console.log(result);
    req.searchReplyResult=result;
    next();
  })
}
app.get('/stringSearch/:string',SearchChannel, SearchPost, SearchReply, (req,res) => {
  res.send({channels:req.searchChannelResult,posts:req.searchPostResult,replies:req.searchReplyResult})
})
const GetUId = (req,res,next) => {
  let uName = req.params.uName;
  let findUser = `SELECT * FROM users WHERE uName LIKE ('%${uName}%')`
  let queryId = connection.query(findUser, (err,result) => {
    if (err) throw err;
    console.log(result);
    req.getUsersList=result;
    next();
  })
}
app.get("/posts/:uid",(req,res) => {
  let uId = req.params.uid;
  let findPosts = `SELECT * FROM posts WHERE uID = ('${uId}')`
  let queryPosts = connection.query(findPosts, (err,result) => {
    if (err) throw err;
    console.log(result);
  res.send({posts:result})
  })
})
app.get("/replies/:uid", (req,res) => {
  let uId = req.params.uid;
  let findReplies = `SELECT * FROM reply WHERE uID = ('${uId}')`
  let queryReplies = connection.query(findReplies, (err,result) => {
    if (err) throw err;
    console.log(result);
    res.send({replies:result})
  })
})
app.get('/searchUser/:uName', GetUId, (req,res) => {
  console.log(req.getUsersList)
  res.send({users:req.getUsersList})
})
const GetPostBW = (req,res,next) => {
  let bestPost = 'SELECT * FROM posts'
  let query = connection.query(bestPost, (err,result) => {
    if (err) throw err;
    console.log(result);
    let arr = result;
    arr.sort((a,b)=>b.VotePost-a.VotePost)
    if(arr.length>1){
      req.bestPost=arr[0];
      req.worstPost=arr[arr.length-1];
    }else{
      req.bestPost="No posts";
      req.worstPost="No posts";
    }
    next();
  })
}
const GetReplyBW = (req,res,next) => {
  let bestReply = 'SELECT * FROM reply'
  let query = connection.query(bestReply, (err,result) => {
    if (err) throw err;
    console.log(result);
    let arr = result;
    arr.sort((a,b)=>b.VoteReply-a.VoteReply)
    if(arr.length>1){
      req.bestReply=arr[0];
      req.worstReply=arr[arr.length-1];
    }else{
      req.bestReply="No replies";
      req.worstReply="No replies";
    }
    next();
  })
}
app.get('/bestWorst/', GetPostBW, GetReplyBW, (req,res) => {
  res.send({bestPost:req.bestPost,worstPost:req.worstPost,bestReply:req.bestReply,worstReply:req.worstReply})
})
app.listen("8080", () => {
  console.log("Server up and listening on 8080");
});