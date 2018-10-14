var conf = require(__dirname+'/config');

var express = require("express");
var app = express(); // init App;
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var cookieParser = require('cookie-parser');
const path = require('path')
var mongoose = require("mongoose");


app.use(cookieParser());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://"+conf.configContent().databaseHost+"/mydb", { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
	console.log("Database is launched");
});
////////////////////////////////////////////////
var PlayerSchema = mongoose.Schema;
var PlayerSchema = new PlayerSchema({
	team: { type: String, unique: true },
	won: { type: Number, default: 0 },
	lost: { type: Number, default: 0 },
	winning: { type: Number, default: 0 },
	points: { type: Number, default: 0}
});
var Player = mongoose.model("players", PlayerSchema);
////////////////////////////////////////////////
var GameSchema = mongoose.Schema;
var GameSchema = new GameSchema({
	player1: { type: String },
	score1: { type: Number},
	player2: { type: String },
	score2: { type: Number}	,
	winner: {type: String},
	time: { type: Date, default: Date.now }
});
var Game = mongoose.model("games", GameSchema);
////////////////////////////////////////////////
app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});
////////////////////////////////////////////////
// Get the Top players
app.get('/top5',function(req, res){
	Player.find({}, null, {sort: {wining: -1}, limit: conf.configContent().numberOfTopPlayer}, function(err, players) {
			if (err) return handleError(err);
			res.json(players);
	});
});
//////////////////////////////////////////////////////
// Get the all players
app.get('/player_lists',function(req, res){
	Player.find({}, null, function(err, players) {
			if (err) return handleError(err);
			res.json(players);
	});
});
//////////////////////////////////////////////////////
// Get  latest games
app.get('/latestGames',function(req, res){
	Game.find({}, null, {sort: {time: -1}, limit: conf.configContent().numberOfLatestGames}, function(err, games) {
			if (err) return handleError(err);
			res.json(games);
	});
});
//////////////////////////////////////////////////////
app.post('/addPlayer', function(req,res){
	var newPlayer = new Player(req.body);
			newPlayer.save(function(error) {
				if (error) console.error(error);
				console.log(newPlayer);
				res.redirect("/")
			});
});
//////////////////////////////////////////////////////
app.post('/addGame', function(req,res){
	var newGame = new Game(req.body);

	if (req.body.score1 > req.body.score2) {
		Player.findOne({team: newGame.player1}, function(err, player1) {
			if (err) return handleError(err);
			player1.won += 1;
			player1.winning = player1.won/(player1.won+player1.lost)*100;
			player1.save(function (err) {
				if(err) {
					console.error(err);
				}
			});

		});
		Player.findOne({team: newGame.player2}, function(err, player2) {
			if (err) return handleError(err);
			player2.lost += 1;
			player2.winning = player2.won/(player2.won+player2.lost)*100;
			player2.save(function (err) {
				if(err) {
					console.error(err);
				}
			});
		});
		newGame.winner = req.body.player1;
	}else if (req.body.score1 < req.body.score2) {
		Player.findOne({team: newGame.player2}, function(err, player2) {
			if (err) return handleError(err);
			player2.won += 1;
			player2.winning = player2.won/(player2.won+player2.lost)*100;
			player2.save(function (err) {
				if(err) {
					console.error(err);
				}
			});
		});
		Player.findOne({team: newGame.player1}, function(err, player1) {
			if (err) return handleError(err);
			player1.lost += 1;
			player1.winning = player1.won/(player1.won+player1.lost)*100;
			player1.save(function (err) {
				if(err) {
					console.error(err);
				}
			});
		});
		newGame.winner = req.body.player1;
	}
	newGame.save(function(error) {
		if (error) console.error(error);
		console.log(newGame);
		res.redirect("/")
	});
});
////////////////////////////////////////////////
app.listen(conf.configContent().WebPort, () => console.log('Server is running.'))
