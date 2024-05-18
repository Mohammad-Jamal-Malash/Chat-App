import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import {logo} from '../assets/index';
import { setUser } from '../context/UserDataSlice/userDataSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../context/store';

type SplachScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SplachScreen'
>;

const SplachScreen = ({navigation}: SplachScreenProps) => {

    const dispatch = useDispatch<AppDispatch>();
  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

    const checkLoggedUser = () =>{
        auth().onAuthStateChanged((userCred)=>{
            if(userCred?.uid){
                firestore()
                .collection('Users')
                .doc(userCred.uid)
                .get()
                .then(docSnap => {
                  if (docSnap.exists) {
                    console.log(docSnap.data());
                    dispatch(setUser(docSnap.data()));
                  }
                }).then(()=>{
                    setTimeout(()=>{
                        navigation.replace('Home');
                    }, 2000)
                });
            }else{
                navigation.replace('Login');
            }
        })
    }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <ActivityIndicator size={'large'} color={'#43C651'} />
    </View>
  );
};

export default SplachScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 50,
  },
});
