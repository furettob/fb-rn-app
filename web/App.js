import React, {useContext} from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import 'react-native-gesture-handler';
import {AuthContext, AuthProvider} from "./utils/context";

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function Nav() {
    const { user } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {user ? (
                <Drawer.Navigator>
                    <Drawer.Screen name="Home" component={HomeScreen}/>
                    <Drawer.Screen name="Week" component={HomeScreen}/>
                </Drawer.Navigator>
            ) : (
                <Drawer.Navigator>
                    <Drawer.Screen name="Login" component={LoginScreen}/>
                </Drawer.Navigator>
            )
            }
        </NavigationContainer>
    )
}

export default function App() {
    return (
      <AuthProvider>
        <Nav/>
      </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
