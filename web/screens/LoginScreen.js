import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../utils/firebase'
import BottomNav from "../components/BottomNav";

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  const handleSignUp = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      //apiCall("createUser", {uid: user.uid, user})
    } catch(error) {
      alert(error.message)
    }
  }

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email || "undistratto@gmail.com", password || "wwwwww")
      //navigation.navigate("Home")
    } catch(error) {
      alert(error.message)
    }
  }

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
      >
        <View style={styles.inputContainer}>
          <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
          />
          <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress={handleLogin}
              style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
            <BottomNav/>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})
