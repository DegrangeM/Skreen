var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const crypto = require('crypto');

app.use(express.static('public'));

const SALT = process.env.SALT === undefined ? '2j3dWJRwFkG3v3U9' : process.env.SALT;
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD === undefined ? 'N7ykH8SMA8pvz4F5' : process.env.TEACHER_PASSWORD;
const PORT = process.env.PORT === undefined ? 3000 : process.env.PORT;

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
  console.log('go to http://localhost:3000');
});


io.on('connect', socket => {
	socket.on('teacher', (pw, fn) => {
		if(typeof pw !== 'string' || typeof fn !== 'function') return;
		if(pw.substr(1) == TEACHER_PASSWORD) {
			socket.join('teacher');
			socket.to('student').emit('who');
			socket.on('create-link', (data, fn) => {
				if(typeof data !== 'string' || typeof fn !== 'function') return;
				fn(crypto.createHmac('sha256', SALT).update(data).digest('hex').substr(0,5));
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
			socket.on('screenshot', data => {
				if(typeof data !== 'string') return;
				socket.to('teacher').emit('screenshot', socket.id, data);
			});
			socket.on('disconnect', () => {
				socket.to('teacher').emit('student-disconnect', socket.id);;
			});
			socket.on('here', () => {
				socket.to('teacher').emit('here', socket.id, socket.name);
			});
			fn(true);
		} else {
			fn(false);
		}
	});
	
});