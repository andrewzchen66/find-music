import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Col, Card, Dropdown, Navbar} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";

// Private information obtained from .env
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

// async function search 

function App() {
  const [searchInput, setSearchInput] = useState("");
  // const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    try{
      console.log("Fetching access tokens");
      const tok = axios.get("http://localhost:8080/get-token")
    } catch(error) {
      console.log("Error fetching data: ", error)
    }
    // ______________________________________
    // try {
    //   // Request API Access Token, expires after 1 hour
    //   var authParameters = {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    //   }

    //   fetch('https://accounts.spotify.com/api/token', authParameters)
    //     .then(result => {
    //       // console.log("Token: " + result.json());
    //       result.json()})
    //     .then(data => setAccessToken(data.access_token))
    // } catch(error) {
    //   console.log("Error fetching data: ", error)
    // }
  }, [])

  // Search
  async function search() {

    if (searchInput === "") {
      console.log("Enter an Artist to Search")
      return
    }
    console.log("Begin Search: " + searchInput);
    const response = await axios.get("http://localhost:8080/search/" + searchInput)
      .then((response) => {
        console.log("Search Response: " + response.data)
        return response.data})
      .then((data) => {
        console.log("Search reached frontend with value " + data)
        setArtistName(data.artistName);
        setAlbums(data.albums);
        return data})
      .catch((error) => {
        console.error("Search Error: " + error);
      });

    // console.log("Search for " + searchInput);
    // var searchParameters = {
    //   method: 'GET',
    //   headers: {
    //       'Content-type': 'application/json',
    //       'Authorization':'Bearer ' + accessToken
    //   },
    // }

    // // Get request using search to get Artist ID
    // try {
    //   var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    //     .then(response => response.json())
    //     .then(data => {
    //       setArtistName(data.artists.items[0].name);
    //       return data.artists.items[0].id;})
    // } catch(error) {
    //   console.log("Error fetching artist id: " + error)
    // }
    // console.log("Artist ID is " + artistID)
    
    // // Get request with Artist ID to grab all the albums from that artist
    // try {
    //   await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album,appears_on&market=US&limit=50', searchParameters)
    //     .then(response => response.json())
    //     .then(data => {
    //       setAlbums(data.items);
    //       return data.items;
    //     })
      
    //   // console.log(albums);
    // } catch(error) {
    //   console.log("Error fetching albums: " + error)
    // }
    // console.log("Albums are: " + albums.map((a) => {return a.name}))
    // console.log(albums)
  }

  return (
    <div className="App">
      <Navbar>Spotifynd</Navbar>
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            // onKeyPress={event => {
            //   if (event.key === "Enter") {
            //     console.log("Pressed enter")
            //   }
            // }}
            onChange={event => setSearchInput(event.target.value)}
          />

          {/* <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}

          <Button onClick={() => search()}> Search </Button>
        </InputGroup>
      </Container>
      <div>
        {artistName === "" ? <p></p> : <p> Displaying {albums.length} results for {artistName}</p>}
      </div>
        
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album) => {
            return <Card>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title className="">{album.name}</Card.Title>
                <Card.Text className="">Release date: {album.release_date}</Card.Text>
                <Card.Text className="">Tracks: {album.total_tracks}</Card.Text>
              </Card.Body>
            </Card>
          })}
          
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
