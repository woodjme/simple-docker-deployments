# Simple Docker Deploy

A stripped down barebones docker deployment service enabling deployments of built docker images available in public docker repositories to a single docker host.

## Installation

Install Docker on the host you would like your containers to run and start the docker-deploy container.

* `docker run -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock woodjme/docker-deploy`

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

`http://localhost:8080/deploy`

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
API app listening at 8080
/deploy
nginx stopped
nginx removed
Pulling image nginx:latest...
Image nginx:latest pulled
Starting new container...
ec0ac0a7314e9853143f5508c8b9dc3cf6a2b6785790dedb16eaee83cf6cba82
```
