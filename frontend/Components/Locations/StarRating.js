import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-ico-material-design';

export const StarRating = ({ rating }) => {
    
    if (!rating) {
        return (
            <View style={styles.starContainer}>
                {[...Array(5)].map((_, index) => (
                    <Icon name='bookmark-button' color='#4578DE'/>
                ))}
            </View>
        );
    } else {
        const filledStars = Math.floor(rating);
        const remainingStars = 5 - filledStars;
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <View style={styles.starContainer}>
                {[...Array(filledStars)].map((_, index) => (
                <Icon name='mark-as-favorite-star' color='#4578DE'/>
                ))}
                {hasHalfStar && <Icon name='half-filled-rating-star' color='#4578DE'/>}
                {[...Array(remainingStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
                <Icon name='bookmark-button' color='#4578DE'/>
                ))}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    star: {
        width: 20,
        height: 20,
        marginRight: 4,
    },
});