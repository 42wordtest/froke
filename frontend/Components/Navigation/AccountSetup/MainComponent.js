import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useUser } from "./UserContext";
import { useNavigation } from "@react-navigation/native";

const MainComponent = () => {
  const [err, setErr] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigation = useNavigation();

  const handleForgotPassword = () => {
    const auth = getAuth();
    const emailAddress = form.email;

    sendPasswordResetEmail(auth, emailAddress)
      .then(() => {
        alert("Password reset email sent. Check your inbox.");
      })
      .catch((err) => {
        if (err.code === "auth/missing-email") {
          alert("Enter your email");
        }
      });
  };

  const signIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {})
      .catch((error) => {
        if (error.code === "auth/invalid-email")
          setErr(
            "Sorry, we can’t find an account with that email and password combination. Please try again."
          );
        else if (error.code === "auth/missing-password")
          setErr("Incorrect Password. Please try again.");
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt=""
            resizeMode="contain"
            style={styles.headerImg}
            source={{
              uri: "https://imagetolink.com/ib/oUhEves5qz.png",
            }}
          />
          <Text style={styles.title}>
            Sign in to <Text style={{ color: "#075eec" }}>froke</Text>
          </Text>
          <Text style={styles.subtitle}>Share your swimming spots</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          {err && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{err}</Text>
            </View>
          )}

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCorrect={false}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <TouchableOpacity
            onPress={() => handleForgotPassword()}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: "#075eec", textAlign: "right" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={signIn}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Sign Up");
            }}
            style={{ marginBottom: 30 }}>
            <Text style={styles.formFooter}>
              Don't have an account?{" "}
              <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#075eec",
    borderColor: "#075eec",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
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

export default MainComponent;
