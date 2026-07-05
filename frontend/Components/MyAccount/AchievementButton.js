import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AchievementButton({ navigation, user }) {
	const handlePress = () => {
		navigation.navigate("Achievements");
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={handlePress}>
				<Text style={styles.buttonText}>Achievements</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	// container: {
	// 	marginTop: 10, 
	// 	alignItems: "center",
	// 	width: "50%", 
	// },
	button: {
		backgroundColor: "#007bff",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		width: 150,
		marginBottom: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	userInfo: {
		color: "white",
		fontSize: 14,
		marginTop: 5,
	},
});
