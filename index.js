
const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const docker = new Docker({
	socketPath: '/var/run/docker.sock'
});

app.use(bodyParser.json());

//Log Requests
app.use(function (req, res, next) {
	console.log(req.path);
	next();
});

app.get('/', (req, res) => {
	res.send('Hello');
});

app.post('/deploy', (req, res) => {
	if (!req.body.service.name || !req.body.service.image) {
		res.status(400);
		res.send('Service not defined');
	} else {
		stopAndRemove(req.body.service.name)
			.then(function () {
				return pullImage(req.body.service.image)
			})
			.then(function () {
				return startNewContainer(req.body.service.name, req.body.service.image)
			})
			.then(function(container) {
				console.log(container.id)
				res.sendStatus(200);
			})
			.catch(function (err) {
				console.log(err)
				res.sendStatus(500)
			})

	}

});

app.listen(port, () => {
	console.log(`API app listening at ${port}`);
});


function stopAndRemove(serviceName) {
	return new Promise((resolve, reject) => {
		docker.listContainers()
			.then(function (containers) {
				if (containers.some(e => (e.Names.includes(`/${serviceName}`)))) {
					docker.getContainer(serviceName)
						.stop()
						.then(function (container) {
							console.log(`${serviceName} stopped`)
							return (container.remove());
						}).then(function () {
							console.log(`${serviceName} removed`)
							resolve()
						}).catch(function (err) {
							reject(err)
						});
				} else {
					console.log('First time we have seen this image')
					resolve()
				}
			})

	})
}

function startNewContainer(serviceName, image) {
	return new Promise((resolve, reject) => {
		console.log('Starting new container...')
		docker.createContainer({
				Image: image,
				AttachStdin: false,
				AttachStdout: false,
				AttachStderr: false,
				Tty: false,
				Cmd: [],
				OpenStdin: false,
				StdinOnce: false,
				name: serviceName
			}).then(function (container) {
				return container.start()
			})
			.then(function (container) {
				resolve(container)
			})
			.catch(function (err) {
				reject(err)
			})

	})
}

function pullImage(image) {
	return new Promise((resolve, reject) => {
		console.log(`Pulling image ${image}...`)
		docker.pull(image, (err, stream) => {
			docker.modem.followProgress(stream, onFinished);

			function onFinished(err) {
				if (err) reject(err)
				console.log(`Image ${image} pulled`)
				resolve()
			}
		});
	})
}

