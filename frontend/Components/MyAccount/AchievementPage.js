import { red } from "@mui/material/colors";
import React from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import achievementImg from '../MyAccount/Achievments.png'


// const updateUserObject = (user) => {
//   return {
//     ...user,
//     swimSpotVisits: user.swimSpotVisits || 0,
//     reviewsPosted: user.reviewsPosted || 0,
//   };
// }

// <AchievementPage user={updateUserObject(user)} />


export default function AchievementPage({ user }) {
	const achievementsData = [
		{
			id: 1,
			title: "First Dip",
			detail: "Complete your first swim in any location.",
		},
		{
			id: 2,
			title: "Marathon Swimmer",
			detail: "Swim a cumulative total of 42 kilometers.",
		},
		{
			id: 3,
			title: "Explorer",
			detail: "Visit and swim in 10 different locations.",
		},
		{
			id: 4,
			title: "Sunrise Swimmer",
			detail: "Take a swim during sunrise at least once.",
		},
		{
			id: 5,
			title: "Midnight Mariner",
			detail: "Experience a midnight swim under the stars.",
		},
		{
			id: 6,
			title: "Nature Lover",
			detail: "Swim in 5 natural water bodies like lakes or rivers.",
		},
		{ id: 7, title: "Social Swimmer", detail: "Join a group swim event." },
		{
			id: 8,
			title: "Photographer",
			detail: "Share 10 photos of different swimming spots.",
		},
		{
			id: 9,
			title: "Review Master",
			detail: "Write 20 reviews for different swimming locations.",
		},
		{
			id: 10,
			title: "Winter Warrior",
			detail: "Take a swim in freezing temperatures.",
		},
		{
			id: 11,
			title: "Distance Challenge",
			detail: "Swim a distance of 5km in a single session.",
		},
		{
			id: 12,
			title: "Health Enthusiast",
			detail: "Swim consistently for 30 days.",
		},
		{
			id: 13,
			title: "International Waters",
			detail: "Swim in at least three different countries.",
		},
		{
			id: 14,
			title: "Sea Adventurer",
			detail: "Complete swims in five different seas.",
		},
		{ id: 15, title: "Lake Conqueror", detail: "Swim in ten different lakes." },
	];

	// const points = calculatePoints(user);

  const renderAchievement = ({ item, index }) => (
    <View style={[styles.achievementItem, { backgroundColor: rainbowColors[index % rainbowColors.length] }]}>
      <Image 
        source={achievementImg} 
        style={styles.trophyIcon}
      />
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDetail}>{item.detail}</Text>
    </View>
  );
	return (
		<View style={styles.container}>
			<Text style={styles.pageTitle}>Achievements</Text>
			<Text style={styles.pointsTitle}>Points: </Text>
			<FlatList
				data={achievementsData}
				renderItem={renderAchievement}
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	);
}

// const calculatePoints = (user) => {
// 	return user.swimSpotVisits * 10 + user.reviewsPosted * 5;
// };

const rainbowColors = [
  '#B8E0F7', 
  '#94C3DF', 
  '#70BFEC', 
  '#4578DE', 
  '#AC57D0', 
  '#D498F7', 
  '#CCB0CA', 
];


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#E7F9FE'
	},
	pageTitle: {
    color: '#00235A',
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
	},
  pointsTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
    color: '#B20000'
	},
  trophyIcon: {
    width: 20,   
    height: 20,  
    marginRight: 5, 
  },
	achievementItem: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#00214E', 
    shadowColor: '#00214E',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10, 
  },
	achievementTitle: {
		fontSize: 18,
		fontWeight: "bold",
    fontStyle: 'italic',
		marginBottom: 5,
	},
	achievementDetail: {
		fontSize: 14,
	},
});
