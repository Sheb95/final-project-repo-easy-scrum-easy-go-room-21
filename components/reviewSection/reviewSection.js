import AddNewReview from '@components/AddNewReview/AddNewReview';
import Review from '@components/Review/Review';
import { Button, Container, Alert } from '@mui/material';
import {
  addReviewBtn,
  centerContentCol,
  centerContentRow,
  courseCardButton,
  showMoreLessButton,
} from 'globalCss';
import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { Box } from '@mui/system';
import SuccessAlert from '@components/SuccessAlert/SuccessAlert';

// This component holds all of the review section
// Data is review section of API
export default function ReviewSection({
  data,
  setNumOfReviews,
  userData,
  courseId,
}) {
  // Used useState to re-render review section on addition of new review
  const [reviewData, setReviewData] = useState(data);
  // Used useState to set boolean to trigger AddNewReviewSection
  const [showAddReview, setShowAddReview] = useState(false);
  const [sendReview, setSendReview] = useState(false);
  const { user, error, isLoading } = useUser();
  const [visible, setVisible] = useState(2);
  const [open, setOpen] = React.useState(false);
  const [newReview, setNewReview] = useState();
  function showMoreItems() {
    setVisible(reviewData.length);
    // setShowAddReview(true);
  }
  useEffect(() => {
    if (sendReview) {
      // send to API
      const fetchFunction = async () => {
        const body = {
          date: newReview.date,
          review_rating: newReview.rating,
          review_text: newReview.review_text,
          reviewer_id: newReview.reviewer_id,
          course_id: courseId,
        };
        const url =
          `${process.env.LOCALHOST}/api/reviews` ||
          `https://servicestack.netlify.app/api/reviews`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body), // let's make the body disappear
          headers: { 'Content-Type': 'application/json' },
        });
      };
      fetchFunction();
    }
    setSendReview(false);
  }, [sendReview]);
  function collapseItems() {
    setVisible(2);
    setShowAddReview(false);
  }

  return (
    <Container sx={centerContentCol}>
      <div className="wrapAddreviewBtn">
        {!showAddReview && (
          <Button
            sx={addReviewBtn}
            onClick={() => {
              if (!user) {
                alert('Please Log in to add review');
              } else {
                setShowAddReview(true);
              }
            }}
          >
            Add review
          </Button>
        )}
      </div>
      {/* <div className="wrapAddreviewBtn">
        {!showAddReview && user && (
          <Button
            sx={addReviewBtn}
            onClick={() => {
              setShowAddReview(true);
            }}
          >
            Add review
          </Button>
        )}
        {!showAddReview && !user && <p> Log in to add review</p>}
      </div> */}
      <Review visible={visible} reviews={reviewData} />
      <Box sx={centerContentRow}>
        {!showAddReview && visible === 2 && reviewData.length > 2 && (
          <Button sx={showMoreLessButton} onClick={() => showMoreItems()}>
            Show more
          </Button>
        )}
        {(showAddReview || visible > 2) && reviewData.length > 2 && (
          <Button sx={showMoreLessButton} onClick={() => collapseItems()}>
            Show less
          </Button>
        )}
      </Box>
      {showAddReview && user && (
        <AddNewReview
          userData={userData}
          reviewData={reviewData}
          setReviewData={setReviewData}
          setShowAddReview={setShowAddReview}
          setSendReview={setSendReview}
          setOpen={setOpen}
          setNumOfReviews={setNumOfReviews}
          sendReview={sendReview}
          setNewReview={setNewReview}
        />
      )}
      <SuccessAlert open={open} setOpen={setOpen} />
    </Container>
  );
}
