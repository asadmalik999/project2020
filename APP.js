const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const url = "mongodb://localhost:27017/";

app.listen(8000, ()=>{ console.log("server started on port 8000"); });

app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));
app.set("images", path.join(__dirname, "images"));
// app.set("view engine", "pug");

app.use(express.static('images'));

app.use(express.static('public'));

app.use(express.static('views'));

app.use(bodyParser.urlencoded({extended: false}));
app.get("/signup", (req, res)=>{
	res.sendFile(path.join(__dirname, "/", "signup.html"));
});

app.get("/login", (req, res)=>{
	res.sendFile(path.join(__dirname, "/", "index.html"));
});
app.get("/signup_api", (req, res)=>{
    res.send(JSON.stringify({'data':"data from signup"}));
});

app.get("/login_customer", function(req,res){

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("Customers");
		dbo.collection("contact_info").find({email:req.body.email},{pass:req.body.pass}).toArray(function(err, result) {
		  if (err) throw err;
		  console.log(result);
		  res.send(JSON.stringify({'data':result}));
		  
		});
	  });
});

//app.use(express.urlencoded());
//app.use(bodyParser);
// Parse JSON bodies (as sent by API clients)
//app.use(express.json());
// Access the parse result


app.get("/index", (req, res)=>{
	res.send("index");
});

 app.get("/thanks", (req, res)=>{
 	res.render("thanks");
 });

app.post("/create-post", (req, res)=>{
	var duplicate =false;
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}, (err, conn)=>{
		if (err) throw err;

		var dbo = conn.db("Customers");
		
		dbo.collection("contact_info").find({email:req.body.email}).toArray(function(err, result) {
			if (err) throw err;
           if(result.length>=1){
			duplicate=true;
		   }
		   insertCustomer(req,res,dbo,duplicate);
	
	}) 
})
});
var insertCustomer = function (req,res,dbo,duplicate){
	if(!duplicate){
		dbo.collection("contact_info").insertOne(req.body, function(err, result) {
			if (err) throw err;
			res.send(JSON.stringify({result: result,duplicate:duplicate}))
			
		  });
	
	}
	else{
		res.send(JSON.stringify({result: undefined,duplicate:duplicate}))

	}
}