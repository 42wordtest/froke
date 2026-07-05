import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { patchLikes } from '../../api';
import Icon from 'react-native-ico-material-design';

export default function ReviewVoter({ review_id, votes_for_review }) {
    const [userLikes, setUserLikes] = useState(0);
    const [isLikesErr, setIsLikesErr] = useState(false);
    
    const updateAllLikes = (value) => {
        setUserLikes((currentLikes) => {
            return currentLikes + value;
        });
        updateAPILikes(value);
    }

    const updateAPILikes = (value) => {
        patchLikes(value, review_id)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                setIsLikesErr(true);
                setUserLikes(0);
            });
    };

    return (
        <>
            {!isLikesErr ? (
                <View style={styles.bottomBanner}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        disabled={userLikes === -1}
                        accessibilityLabel="dislike"
                        onPress={() => {
                        updateAllLikes(-1);
                        }}
                    >
                        <Icon name="thumb-down-button" color={userLikes === -1 ? '#e0e0e0' : '#4578DE'} />
                    </TouchableOpacity>
                    <Text style={styles.voteCount}>{votes_for_review + userLikes}</Text>
                    <TouchableOpacity
                        disabled={userLikes === 1}
                        accessibilityLabel="like"
                        onPress={() => {
                        updateAllLikes(1);
                        }}
                        style={[styles.button, userLikes === 1 && styles.disabledButton]}
                    >
                        <Icon name="thumb-up-button" color={userLikes === 1 ? '#e0e0e0' : '#4578DE'} />
                    </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text>Likes not currently working</Text>
            )}
        </>
    );
}

const styles = {
    bottomBanner: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 70
    },
    voteCount: {
        color: '#4578DE', 
        fontWeight: 'bold', 
        fontSize: 18, 
    },
    button: {
        filter: 'grayscale(100%)'
    },
    disabledButton: {
        filter: 'grayscale(100%)',
    },
};
