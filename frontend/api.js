import axios from 'axios';
import {
  fetchGovernmentLocations,
  getGovernmentLocationById,
} from './services/governmentLocations';

const apiBaseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:9090/api';
const freeStrokeAPI = axios.create({ baseURL: apiBaseURL });

export const getLocationByID = (location_id) => {
  return getGovernmentLocationById(location_id);
};

export const getReviewsById = (location_id, page) => {
  const query = {
    params: {
      p: page,
    },
  };

  return freeStrokeAPI.get(`/locations/${location_id}/reviews`, query).then(({ data }) => {
    return data;
  });
};

export const deleteReview = (review_id) => {
  return freeStrokeAPI.delete(`/reviews/${review_id}`);
};

export const postReview = (location_id, reviewToBeAdded) => {
  return freeStrokeAPI.post(`/locations/${location_id}/reviews`, reviewToBeAdded);
};

export const patchLikes = (value, review_id) => {
  return freeStrokeAPI.patch(`/reviews/${review_id}`, { inc_votes: value });
};

export const getLocations = (options = {}) => {
  return fetchGovernmentLocations(options).then((locations) => ({
    locations,
    total_count: locations.length,
  }));
};

export const postLocation = (locationToBeAdded) => {
  return freeStrokeAPI.post('/locations', locationToBeAdded);
};
