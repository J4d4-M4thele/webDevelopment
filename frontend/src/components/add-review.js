import React, { useState } from 'react';
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props => {

   let editing = false
   let initialReviewState = ''

   const [review, setReview] = useState(initialReviewState)
   //keeps track if review's submitted
   const [submitted, setSubmitted] = useState(false)

   const onChangeReview = e => {
      const review = e.target.value
      setReview(review);
   }

   const saveReview = () => {
      var data = {
         review: review,
         name: props.user.name,
         user_id: props.user.id,
         //get movie from direct url
         movie_id: props.match.params.id
      }
   }
   
   MovieDataService.createReview(data)
   .then(response => {
      setSubmitted(true)
   })
   .catch(e => {
      console.log(e)
   })

   return (
      <div>
         Add Review
      </div>
   );
}

export default AddReview;