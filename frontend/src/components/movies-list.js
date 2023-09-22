import React, { useState, useEffect } from 'react'
import MovieDataService from "../services/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

const MoviesList = props => {

   const [movies, setMovies] = useState([])
   const [searchTitle, setSearchTitle] = useState("")
   const [searchRating, setSearchRating] = useState("")
   const [ratings, setRatings] = useState(["All Ratings"])

   //specifying pages 
   const [currentPage, setCurrentPage] = useState(0)
   const [entriesPerPage, setEntriesPerPage] = useState(0)

   //assist in getting next page's movies
   const [currentSearchMode, setCurrentSearchMode] = useState("")

   useEffect(() => {
      setCurrentPage(0)
   }, [currentSearchMode])

   //retrieve next page is rendered once only
   useEffect(() => {
      // retrieveMovies()
      retrieveNextPage()
   }, [currentPage])

   useEffect(() => {
      retrieveMovies()
      retrieveRatings()
   }, [])
   
   //uses if logic to invoke functions
   const retrieveNextPage = () => {
      if(currentSearchMode === 'findByTitle')
        findByTitle()
      else if(currentSearchMode === 'findByRating')
        findByRating()
      else 
       retrieveMovies()
   }

   const retrieveMovies = () => {
      //ch 24
      setCurrentSearchMode('')
      MovieDataService.getAll()
         .then(response => {
            console.log(response.data)
            setMovies(response.data.movies) // assign to movies state
            //changing pages and number of movies per page
            setCurrentPage(response.data.page)
            setEntriesPerPage(response.data.entries_per_page)
         })
         .catch(e => {
            console.log(e)
         })
   }

   const retrieveRatings = () => {
      MovieDataService.getRatings()
         .then(response => {
            console.log(response.data)
            setRatings(["All Ratings"].concat(response.data))
         })
         .catch(e => {
            console.log(e)
         })
   }

   const onChangeSearchTitle = e => {
      const searchTitle = e.target.value
      setSearchTitle(searchTitle);
   }

   const onChangeSearchRating = e => {
      const searchRating = e.target.value
      setSearchRating(searchRating);
   }



   const find = (query, by, currentPage) => {
      MovieDataService.find(query, by)
         .then(response => {
            console.log(response.data)
            setMovies(response.data.movies)
         })
         .catch(e => {
            console.log(e)
         })
   }
   // find function sypported by below two methods
   const findByTitle = () => {
      //ch 24
      setCurrentSearchMode("findByTitle")
      find(searchTitle, "title")
   }
   const findByRating = () => {
      //ch 24
      setCurrentSearchMode("findByRating")
      if (searchRating === "All Ratings") {
         retrieveMovies()
      }
      else {
         find(searchRating, "rated")
      }
   }

   return (
      <div className="App">
         <Container>
            <Form>
               <Row>
                  <Col>
                     <Form.Group>
                        <Form.Control
                           type="text"
                           placeholder="Search by title"
                           value={searchTitle}
                           onChange={onChangeSearchTitle}
                        />
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByTitle}
                     >
                        Search
                     </Button>
                  </Col>
                  <Col>
                     <Form.Group>
                        <Form.Control as="select" onChange={onChangeSearchRating} >
                           {ratings.map(rating => {
                              return (
                                 <option value={rating}>{rating}</option>
                              )
                           })}
                        </Form.Control>
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByRating}
                     >
                        Search
                     </Button>
                  </Col>
               </Row>
            </Form>

            <Row>
               {movies.map((movie) => {
                  return (
                     <Col>
                        <Card style={{ width: '18rem' }}>
                           <Card.Img src={movie.poster + "/100px180"} />
                           <Card.Body>
                              <Card.Title>{movie.title}</Card.Title>
                              <Card.Text>
                                 Rating: {movie.rated}
                              </Card.Text>
                              <Card.Text>
                                 {movie.plot}
                              </Card.Text>
                              <Link to={"/movies/" + movie._id} >View Reviews</Link>
                           </Card.Body>
                        </Card>
                     </Col>
                  )
               })}
            </Row>
         </Container>
         <br />
            Showing page : {currentPage}
            <Button
               variant='link'
               onClick={() => { setCurrentPage(currentPage + 1) }}>
               Get next {entriesPerPage} results
            </Button>
      </div>
   );
}


export default MoviesList;