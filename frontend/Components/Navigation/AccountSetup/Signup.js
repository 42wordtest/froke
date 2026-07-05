import React, { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";

const INPUT_OFFSET = 150;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const navigation = useNavigation();

  const signUp = () => {
    if (!username.trim()) {
      setErr("Username is required");
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => {
        navigation.navigate("Main");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setErr("Email has an existing account.");
        } else if (error.code === "auth/weak-password") {
          setErr("Password must be at least 6 characters");
        } else if (
          error.code === "auth/missing-password" ||
          "auth/invalid-email"
        ) {
          setErr("Fill in all the details");
        }
        console.log(error.code);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerAction}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <FeatherIcon name="arrow-left" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.headerTitle}>Create an account</Text>

            <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
              <TouchableOpacity>
                <FeatherIcon name="more-vertical" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAwareScrollView>
            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Username</Text>

                <TextInput
                  onChangeText={(username) => setUsername(username)}
                  placeholder="johndoe"
                  placeholderTextColor="#BFBFBF"
                  style={styles.inputControl}
                  value={username}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Email</Text>

                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(email) => setEmail(email)}
                  placeholder="john@example.com"
                  placeholderTextColor="#BFBFBF"
                  style={styles.inputControl}
                  value={email}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>

                <TextInput
                  autoCorrect={false}
                  onChangeText={(password) => setPassword(password)}
                  placeholder="********"
                  placeholderTextColor="#BFBFBF"
                  style={styles.inputControl}
                  secureTextEntry={true}
                  value={password}
                />
              </View>

              {err && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{err}</Text>
                </View>
              )}

              <View style={styles.formAction}>
                <TouchableOpacity onPress={signUp}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Create my account</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
    backgroundColor: "#fff",
  },
  formAction: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  formFooter: {
    paddingHorizontal: 16,
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: "#44465a",
  },
  input: {
    marginBottom: 0,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
  },
  inputLabel: {
    position: "absolute",
    width: INPUT_OFFSET,
    lineHeight: 44,
    top: 0,
    left: 0,
    bottom: 0,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#54565f",
    zIndex: 9,
    textTransform: "uppercase",
  },
  inputControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingLeft: INPUT_OFFSET,
    paddingRight: 24,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "500",
    color: "#222",
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.133,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#3F62D0",
    borderColor: "#3F62D0",
  },
  errorContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
});

export default Signup;
