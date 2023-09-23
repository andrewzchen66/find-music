import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Col, Card, Dropdown, Navbar} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";

// Creates all the Searching functionality for the app
const Search = () => {
    const [searchInput, setSearchInput] = useState("");
    const [albums, setAlbums] = useState([]);
    const [artistName, setArtistName] = useState("");

    // Updates albums and artistName state, performs the actual search
    async function search() {

        if (searchInput === "") {
        console.log("Enter an Artist to Search")
        return
        }
        console.log("Begin Search: " + searchInput);
        await axios.get("http://localhost:8080/search/" + searchInput)
        .then((response) => {
            return response.data})
        .then((data) => {
            setArtistName(data.artistName);
            setAlbums(data.albums);
            return data})
        .catch((error) => {
            console.error("Search Error: " + error);
        });
    }

    return(
        <div>
            <div class="Title">
                <h1>Spotifynder Search</h1>
            </div>
            <Container>
            <InputGroup className="mb-3" size="lg">
                <FormControl
                    placeholder="Search for Artist"
                    type="input"
                    onChange={event => setSearchInput(event.target.value)}
                />
                
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
        </div>)
}

export default Search