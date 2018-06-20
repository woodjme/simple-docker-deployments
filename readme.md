# Simple Docker Deploy

A stripped down barebones docker deployment service enabling deployments of built docker images available in public docker repositories to a single docker host.

*This project should not be used in a production environment!*

## Installation

Needs to be installed on a machine that has Docker installed and running.

* Clone repo
* `npm install`
* `node index.js`

Would be a good idea to use a process manager such as [pm2](http://pm2.keymetrics.io) to keep the service running in the background.

### ToDo

* Run within Docker

## Usage

Send a `POST` request to the web server with a `JSON` body detailed below.

```json
{
    "service": {
        "name": "nginx",
        "image": "nginx:latest"
    }
}
```

## Example

### Request

#### Route

`http://localhost:8085/deploy`

#### Body

```json
{
    "service": {
        "name": "nginx",
        "image": "nginx:latest"
    }
}
```

### Output

```zsh
API app listening at 8085
/deploy
nginx stopped
nginx removed
Pulling image nginx:latest...
Image nginx:latest pulled
Starting new container...
ec0ac0a7314e9853143f5508c8b9dc3cf6a2b6785790dedb16eaee83cf6cba82
```
