import React, { useContext } from 'react'
import { AuthContext } from "../utils/context";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../utils/firebase'
import {getUserList} from "../utils/api"

const HomeScreen = () => {
    const { user } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            const x = await auth.signOut()
        }
        catch(error) {
            alert(error.message)
        }
    }

    const handleAPIRequest = async () => {
        console.log(user)
        await getUserList(user)
    }

    return (
        <View style={styles.container}>
            <Text>Email: {user?.email}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleAPIRequest}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.buttonOutlineText}>API CALL</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})
