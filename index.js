// Basic template with Node.JS, Express, CursusDB
import express from 'express'
import Client from 'cursusdb-node'

const app = express();
const client = new Client("0.0.0.0", "7681", "username", "password", false)

app.use(express.json());

// Get all posts
app.get('/posts', async (req, res) => {
    let authenticated = checkAuth(req.headers)

    if (!authenticated) {
            res.status(401)
            res.send(`{"message": "Not allowed."}`)
            return
    }

    client.Query(`select * from posts;`).then((results) => {
        res.send(results)
    })
});

// Insert new post into posts collection
app.post('/posts', async (req, res) => {
    let authenticated = checkAuth(req.headers)
    
    if (!authenticated) {
            res.status(401)
            res.send(`{"message": "Not allowed."}`)
            return
    }

    if (!req.body.title && !req.body.body) {
        res.send(`{"message": "Missing post title and body."}`)
        return
    }
    // posts collection json document structure example:
    // {"title": "Test post 1", "body": "Hello world!"}
    client.Query(`insert into posts(${JSON.stringify(req.body)});`).then((results) => {
        res.send(results)
    })

});

// Takes a post title and updates body
app.put('/posts', async (req, res) => {
    let authenticated = checkAuth(req.headers)
    
    if (!authenticated) {
            res.status(401)
            res.send(`{"message": "Not allowed."}`)
            return
    }


    if (!req.body.title && !req.body.body) {
        res.send(`{"message": "Missing post title and body for update."}`)
        return
    }
    client.Query(`update 1 in posts where title = '${req.body.title}' set body = '${req.body.body}';`).then((results) => {
        res.send(results)
    })
});

// Takes a post title and deletes it
app.delete('/posts', async (req, res) => {
    let authenticated = checkAuth(req.headers)
    
    if (!authenticated) {
            res.status(401)
            res.send(`{"message": "Not allowed."}`)
            return
    }


    if (!req.body.title) {
        res.send(`{"message": "Missing post title."}`)
        return
    }

    client.Query(`delete 1 from posts where title = '${req.body.title}';`).then((results) => {
        res.send(results)
    })
});

// On end close database connection
process.on('SIGTERM', () => {
    client.Close()
});

client.Connect().then((res) => {
        console.log(res)
        const port = parseInt(process.env.PORT) || 8080;

        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });

}).catch((err) => {
        console.error(err)
        process.exit(1)
})

function checkAuth(headers) {
    if (headers["authorization"].split("Basic ").length < 2) {
        return false
    }

    let authorization =  Buffer.from(headers["authorization"].split("Basic ")[1], 'base64').toString('utf8').split(":")
    if (authorization.length < 2) {
        return false
    }

    let username = authorization[0]
    let password = authorization[1]

    // For this example we wont read from the database and add to much here
    // But you should add another api to create users and make sure to bcrypt passwords.
    // const user = client.Query(`select 1 from users where username = 'x';)
    // Check the users password hash against plain with bcrypt
    // Again for this example we will keep it simple
    if (username == "template" && password == "template") {
        return true
    } else {
        return false
    }
}