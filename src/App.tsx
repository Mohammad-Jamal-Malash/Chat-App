import {StatusBar, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {AddToChat, Home, Login, ProfileScreen, SignUp, SplachScreen, chatScreen} from './screens/index';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './context/store';


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  SplachScreen : undefined;
  AddToChat: undefined;
  chatScreen: any;
  ProfileScreen: undefined;
};

const stack = createNativeStackNavigator<RootStackParamList>();




const App: FC<RootStackParamList> = ({}) => {
  return (
    <NavigationContainer>
      <Provider store={store}>
      <StatusBar hidden  showHideTransition={'fade'}/>
      <stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <stack.Screen name='SplachScreen' component={SplachScreen} />
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="Signup" component={SignUp} />
        <stack.Screen name="Home" component={Home} />
        <stack.Screen name="AddToChat" component={AddToChat} />
        <stack.Screen name="chatScreen" component={chatScreen} />
        <stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
