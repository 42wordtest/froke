import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ReviewList from './ReviewList';
import React, { useState } from "react";
import PostReview from './PostReview';
import Icon from 'react-native-ico-material-design';

export default function ReviewContainer({location_id, setReviewCount, reviewCount, setAverageRating, averageRating}) {
  const [reviews, setReviews] = useState([]);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.reviewsBanner}
        >
          <Text style={styles.reviewsHeader}>Reviews</Text>
          <View style={styles.reviewCountContainer}>
          <Icon name='add-comment-button' color='#4578DE'/>
            <Text style={styles.reviewCountText}>{reviewCount}</Text>
          </View>
        </TouchableOpacity>
        <PostReview
          location_id={location_id}
          reviews={reviews}
          setReviews={setReviews}
          reviewCount={reviewCount}
          setReviewCount={setReviewCount}
          averageRating={averageRating}
          setAverageRating={setAverageRating}
        />
        <ReviewList
          reviews={reviews}
          setReviews={setReviews}
          location_id={location_id}
          reviewCount={reviewCount}
          setReviewCount={setReviewCount}
          averageRating={averageRating}
          setAverageRating={setAverageRating}
        />
      </View>
    )
  }

const styles = StyleSheet.create({
  reviewsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#D6DBFE',
    width: 352,
    height: 30,
    paddingHorizontal: 10,
    justifyContent: 'space-between', 
  },
  reviewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsHeader: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 17,
    letterSpacing: 1
  },
  reviewCountText: {
    color: '#4578DE',
    fontSize: 17,
    marginLeft: 5,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginHorizontal: 30,
    marginTop: 20
  },
  header2: {
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10,
  },
})