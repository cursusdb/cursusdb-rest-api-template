## REST API template with Node.JS and CursusDB with basic auth
This template contains a Node.JS, Express, and CursusDB REST API with Basic Auth.
The basic auth is very simplified but with an example on how to implement it.

This REST API template contains a ``/posts`` route that has all CRUD capabilities.
Basic Auth creds are:

Username: ``template``

Password: ``template``


### POST
```
{
    "title": "Test post 1",
    "body": "Hello world"
}
```

### GET
```
Gets all posts
```

### PUT
Update post where title is ``Test post 1`` to a new body
```
{
    "title": "Test post 1",
    "body": "Hello world this is an update"
}
```

### DELETE
Delete 1 posts where title is ``Test post 1``
```
{
    "title": "Test post 1",
}
```