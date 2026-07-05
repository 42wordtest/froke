import { StyleSheet, Text,  View, FlatList, ActivityIndicator, Button } from 'react-native';
import ReviewCard from './ReviewCard';
import { getReviewsById } from '../../api';
import React, { useEffect, useState } from 'react';

export default function ReviewList ({reviews , setReviews, location_id, reviewCount, setReviewCount, averageRating, setAverageRating }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [renderDelayed, setRenderDelayed] = useState(false);

    const reviewsPerPage = 10

    useEffect(() => {
        if (!reviewLoading) {
            setTimeout(() => {
                setRenderDelayed(true);
            }, 200);
        }
    }, [reviewLoading]);

    useEffect(() => {
        loadReviews(currentPage);
    }, [location_id, currentPage]);

    const loadReviews = (page) => {
        getReviewsById(location_id, page)
        .then((data) => {
            const newReviews = data.reviews
            newReviews.sort((a, b) => b.review_id - a.review_id);
            setReviews(newReviews)
            setReviewCount(data.total_count)
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setReviewLoading(false);
        })
    };

    const handleLoadMore = () => {
        setCurrentPage(currentPage + 1);
    };

    const visibleReviews = reviews.slice(0, currentPage * reviewsPerPage);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {reviewLoading ? (
                <ActivityIndicator size="large" color="#1937E0" />
            ) : (
                <>
                {reviews.length === 0 ? (
                    <Text style={styles.noReviewsText}>No reviews yet</Text>
                ) : (
                    <>
                    {renderDelayed && (
                        <FlatList
                        data={visibleReviews}
                        keyExtractor={(item) => item.review_id.toString()}
                        renderItem={({ item }) => (
                            <ReviewCard
                            review_id={item.review_id}
                            body={item.body}
                            username={item.username}
                            votes_for_review={item.votes_for_review}
                            rating_for_location={item.rating_for_location}
                            created_at={item.created_at}
                            setReviews={setReviews}
                            reviews={reviews}
                            reviewCount={reviewCount}
                            setReviewCount={setReviewCount}
                            averageRating={averageRating}
                            setAverageRating={setAverageRating}
                            />
                        )}
                        />
                    )}
                    {reviewCount >= currentPage * reviewsPerPage && (
                        <Button title="Load More Reviews" onPress={handleLoadMore} />
                    )}
                    </>
                )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    noReviewsText: {
        fontSize: 15,
        marginLeft: 2
    }
})
