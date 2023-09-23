import express from "express";
import { Db, MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";
require("dotenv").config(".env");

const app = express();
const port = 8080; // Default port to listen on.
let db: Db;
// Private information
const CLIENT_ID: string = process.env.CLIENT_ID;
const CLIENT_SECRET: string = process.env.CLIENT_SECRET;
let accessToken: string;
let artistName: string;
let artistID: string;
let albums: any;

// Middleware.
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(async (req, res, next) => {
//   try {
//     const authParameters = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
//     }
//     const accessToken = await fetch('https://accounts.spotify.com/api/token', authParameters)
//       .then(result => result.json())
//       .then(data => data.access_token)
//     req.accessToken = accessToken;
//     next();
//     return res.json(accessToken);
//   } catch(error) {
//     return res.status(500).send();
//   }
// })

// ====================================================================
// Routes
// ====================================================================

// Requests the API Access Token, expires after 1 hour
app.get("/get-token", async (req, res) => {
  try {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    accessToken = await fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => data.access_token)
    return res.json(accessToken);
  } catch(error) {
    return res.status(500).send();
  }
})
// _____________________________________________
// Requests an artist name and an array of album search results based on user's searchbar input
app.get("/search/:searchInput", async (req, res) => {
  const searchInput = req.params.searchInput;
  console.log("Search for " + searchInput);
  console.log("Token: " + accessToken);
  const searchParameters = {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
        'Authorization':'Bearer ' + accessToken
    },
  }

  // Get request using search to get Artist ID
  let artist: { name: string, id: string };
  console.log("Fetching artist... with token: " + accessToken)
  try {
    artist = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => {
        console.log("we did it: " + response);
        return response.json();})
      .then(data => {
        console.log("DATA: " + data);
        console.log("artist: " + data.artists.items[0]);
        return data.artists.items[0];
      })
  } catch(error) {
    console.log("Error fetching artist: bruh " + error)
  }
  artistName = artist.name;
  artistID = artist.id;
  console.log("Artist ID is " + artistID);
  console.log("Artist name is " + artistName);

  // Get request with Artist ID to grab all the albums from that artist
  try {
    albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album,appears_on&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => data.items)
  } catch(error) {
    console.log("Error fetching albums: " + error)
  }

  console.log("Albums are: " + albums.map((a: any) => {return a.name}))
  console.log("artistName is: " + artistName);

  return res.json(
    {
      artistName,
      albums,
   })
})


app.get("/", async (req, res) => {
  return res.send("Hello, world!")
})

// TODO: Implement a route handler that returns a list of all posts, ordered by date created.
app.get("/posts", async (req, res) => {
  // res.send("TODO: GET /posts");

  const collection = db.collection("posts");
  const result = await collection.find({}).toArray()
  return res.json(result);
});

// TODO: Implement a route handler that creates a new post.
app.post("/posts", async (req, res) => {
  // res.send("TODO: POST /posts");
  const postBodyData = req.body;
  const collection = db.collection("posts");
  const newPost = {title: postBodyData.title, body: postBodyData.body, createdAt: new Date()};
  try {
      await collection.insertOne(newPost);
      return res.json(newPost);
  } catch (e) {
      return res.status(500).send();
  }
});

// TODO: Implement a route handler that gets a post associated with a given postID.
app.get("/posts/:postID", async (req, res) => {
  // res.send("TODO: GET /posts/{postID}");
  const postID = req.params.postID;
  const collection = db.collection("posts");
  try {
      const result = await collection.findOne({"_id": new ObjectId(postID)});
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no course found with id ${postID}`);
  }

});

// TODO: Implement a route handler that updates the post associated with a given postID.
app.patch("/posts/:postID", async (req, res) => {
  // res.send("TODO: PATCH /posts/{postID}");
  const postID = req.params.postID;
  const data = req.body;
  const collection = db.collection("posts");
  try {
      const result = await collection.updateOne({"_id": new ObjectId(postID)}, {$set: data});
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no course found with id ${postID}`);
  }
});

// TODO: Implement a route handler that deletes the post associated with a given postID.
app.delete("/posts/:postID", async (req, res) => {
  // res.send("TODO: DELETE /posts/{postID}");
  const postID = req.params.postID;
  const collection = db.collection("posts");
  try {
      const result = await collection.deleteOne({"_id": new ObjectId(postID)});
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no post found with id ${postID}`);
  }
});

// TODO: Implement a route handler that gets all the comments associated with a given postID.
app.get("/posts/:postID/comments", async (req, res) => {
  // res.send("TODO: GET /posts/{postID}/comments");
  const postID = req.params.postID;
  const collection = db.collection("comments");
  try {
      const result = await collection.find({"post": new ObjectId(postID)}).toArray();
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no comments for the post found with id ${postID}`);
  }
});

// TODO: Implement a route handler that gets adds a comment to the post with the given postID.
app.post("/posts/:postID/comments", async (req, res) => {
  // res.send("TODO: POST /posts/{postID}/comments");
  const postID = req.params.postID;
  const postBodyData = req.body;
  const collection = db.collection("comments");
  const newComment = {content: postBodyData.content, post: new ObjectId(postID), createdAt: new Date()};
  try {
      await collection.insertOne(newComment);
      return res.json(newComment);
  } catch (e) {
      return res.status(500).send();
  }
});

// TODO: Implement a route handler that gets a comment associated with the given commentID.
app.get("/posts/:postID/comments/:commentID", async (req, res) => {
  // res.send("TODO: GET /posts/{postID}/comments/{commentID}");
  const commentID = req.params.commentID;
  const collection = db.collection("comments");
  try {
      const result = await collection.findOne({"_id": new ObjectId(commentID)});
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no post found with id ${commentID}`);
  }
});

// TODO: Implement a route handler that updates a comment associated with the given commentID.
app.patch("/posts/:postID/comments/:commentID", async (req, res) => {
  // res.send("TODO: PATCH /posts/{postID}/comments");
  const commentID = req.params.commentID;
  const data = req.body;
  const collection = db.collection("comments");
  try {
      const result = await collection.updateOne({"_id": new ObjectId(commentID)}, {$set: data});
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no comment found with id ${commentID}`);
  }
});

// TODO: Implement a route handler that deletes a comment associated with the given commentID.
app.delete("/posts/:postID/comments/:commentID", async (req, res) => {
  // res.send("TODO: DELETE /posts/{postID}/comments");
  const commentID = req.params.commentID;
  const collection = db.collection("comments");
  try {
      const result = await collection.deleteOne({"_id": new ObjectId(commentID)});
      return res.json(result);
  } catch (e) {
      return res.status(404).send(`no comment found with id ${commentID}`);
  }
});

app.get("/", async(req, res) => {

})


// ... add more endpoints here!

// start the Express server
function start() {
  let db;
  console.log("Connecting to " + process.env.ATLAS_URI)
  const client = new MongoClient(process.env.ATLAS_URI);
  console.log("Mongo Instance Created")
  client.connect()
      .then(() => {
          console.log('Connected successfully to server');
          db = client.db('database');
          app.listen(port, () => {
              console.log(`server started at http://localhost:${port}`);
          });
      })
      .catch(() => {
          console.log("Error connecting to mongoDB!");
      });
}

start();