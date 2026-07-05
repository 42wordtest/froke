import axios from 'axios'

const apiBaseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:9090/api'

const freeStrokeAPI = axios.create({ baseURL : apiBaseURL})

export const getLocationByID = (location_id) => {
    return freeStrokeAPI.get(`/locations/${location_id}`)
    .then ((res) => {
        return res.data.location
    })
}

export const getReviewsById = (location_id, page) =>{
    const query = {
        params: {
            p: page
        },
    };

    return freeStrokeAPI.get(`/locations/${location_id}/reviews`, query)
    .then(({data}) =>{
        return data
    })
}

export const deleteReview = (review_id) => {
    return freeStrokeAPI.delete(`/reviews/${review_id}`)
}

export const postReview = (location_id, reviewToBeAdded) => {
    return freeStrokeAPI.post(`/locations/${location_id}/reviews`, reviewToBeAdded)
}

export const patchLikes = (value, review_id) => {
    return freeStrokeAPI.patch(`/reviews/${review_id}`, {inc_votes: value})
}

export const getLocations = () => {
    return freeStrokeAPI.get(`/locations?limit=1000`).then ((res) => {
        return res.data
    })
}

export const postLocation = (locationToBeAdded) => {
    return freeStrokeAPI.post(`/locations`, locationToBeAdded)
}
