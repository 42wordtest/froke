import { FlatList, StyleSheet, View } from 'react-native';
import SingleLocationContainer from './SingleLocationContainer';
import ReviewContainer from '../Reviews/index';
import React, { useEffect, useState } from 'react';
import { getLocationByID } from '../../api';
import Loading from '../Loading/Loading';
import { createLocationTable, findID } from '../../localDatabase/database.js';
import { ErrorState } from '../UI/States';
import { colors } from '../../design/theme';

export default function SingleLocation({route}) {
  const location_id = route.params;
  const [location, setLocation] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [singleLoading, setSingleLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSingleLoading(true);
    setError(null);
    getLocationByID(location_id)
      .then((nextLocation) => {
        setLocation(nextLocation);
        setReviewCount(nextLocation.total_count || 0);
        setAverageRating(nextLocation.avg_rating || 0);
        return findID(location_id)
          .then((res) => {
            if (JSON.parse(res).length === 1) setSaved(true);
          })
          .catch(() => createLocationTable());
      })
      .catch((err) => {
        console.log(err);
        setError('This location could not be loaded.');
      })
      .finally(() => setSingleLoading(false));
  }, [location_id]);

  if (singleLoading) {
    return (
      <View style={styles.loading}>
        <Loading style={{ width: 500, height: 1000 }}/>
      </View>
    );
  }

  if (error || !location) return <ErrorState message={error || 'Location not found.'} />;

  return (
    <FlatList
      style={styles.screen}
      ListHeaderComponent={() => (
        <View style={styles.content}>
          <SingleLocationContainer location={location} reviewCount={reviewCount} averageRating={averageRating} saved={saved}/>
          {location.source === 'gov-uk' ? null : (
            <ReviewContainer location_id={location_id} reviewCount={reviewCount} setReviewCount={setReviewCount} averageRating={averageRating} setAverageRating={setAverageRating} />
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 90,
  },
});
