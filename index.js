var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const crypto = require('crypto');

app.use(express.static('public'));

const CONFIG = {
	SALT: '2j3dWJRwFkG3v3U9',
	TEACHER_PASSWORD: 'N7ykH8SMA8pvz4F5',
	PORT: 3000,
	SCREEN_INTERVAL: 2000, // Temps entre deux captures
	MAX_SIZE: 500, // Hauteur / Largeur maximale de la capture en mode normal
	QUALITY: 0.5, // Qualité de l'image (entre 0 et 1)
}

// On remplace la configuration par les valeurs saisies sur Heroku
const SALT = process.env.SALT === undefined ? CONFIG.SALT : process.env.SALT;
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD === undefined ? CONFIG.TEACHER_PASSWORD : process.env.TEACHER_PASSWORD;
const PORT = process.env.PORT === undefined ? CONFIG.PORT : process.env.PORT;
const SCREEN_INTERVAL = process.env.SCREEN_INTERVAL === undefined ? CONFIG.SCREEN_INTERVAL : process.env.SCREEN_INTERVAL;
const MAX_SIZE = process.env.MAX_SIZE === undefined ? CONFIG.MAX_SIZE : process.env.MAX_SIZE;
const QUALITY = process.env.QUALITY === undefined ? CONFIG.QUALITY : process.env.QUALITY;

/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/teacher', (req, res) => {
  res.sendFile(__dirname + '/teacher.html');
});
app.get('/student', (req, res) => {
  res.sendFile(__dirname + '/student.html');
});
*/

http.listen(PORT, () => {
  console.log('go to http://localhost:3000/teacher.html#' + TEACHER_PASSWORD);
});


io.on('connect', socket => {
	socket.on('teacher', (pw, fn) => {
		if(typeof pw !== 'string' || typeof fn !== 'function') return;
		if(pw.substr(1) == TEACHER_PASSWORD) {
			socket.join('teacher');
			socket.to('student').emit('who');
			socket.on('create-link', (data, fn) => {
				if(typeof data !== 'string' || typeof fn !== 'function') return;
				let names = data.trim().split(/[\r\n]+/).map(function(name) {
					return name + '/' + crypto.createHmac('sha256', SALT).update(name).digest('hex').substr(0,5)
				});
				fn(names);
			});
			socket.on('highQuality', (id, b) => {
				if(typeof id !== 'string' || typeof b !== 'boolean') return;
				socket.to(id).emit('highQuality', b);
			})
			fn(true);
		} else {
			fn(false);
		}
	});
	socket.on('student', (data, fn) => {
		if(typeof data !== 'string' || typeof fn !== 'function') return;
		let datas = data.substr(1).split('/');
		let name = decodeURIComponent(datas[0]);
		let hash = datas[1];
		let goodhash = crypto.createHmac('sha256', SALT).update(name).digest('hex').substr(0,5);

		if(hash == goodhash) {
			socket.name = name;
			socket.join('student');
			socket.to('teacher').emit('student-connect', socket.id, socket.name);
			socket.on('screenshot', (data, fn) => {
				if(typeof data !== 'string' || typeof fn !== 'function') return;
				fn();
				socket.to('teacher').emit('screenshot', socket.id, data);
			});
			socket.on('disconnect', () => {
				socket.to('teacher').emit('student-disconnect', socket.id);;
			});
			socket.on('here', () => {
				socket.to('teacher').emit('here', socket.id, socket.name);
			});
			fn(true, {
				interval: SCREEN_INTERVAL,
				maxSize: MAX_SIZE,
				quality: QUALITY
			});
		} else {
			fn(false);
		}
	});
	
});