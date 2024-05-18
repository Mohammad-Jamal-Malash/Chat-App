import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {Bg, logo} from '../assets/index';
import UserTextInput from '../components/UserTextInput';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import { AppDispatch } from '../context/store';
import {setUser, setUserNull} from '../context/UserDataSlice/userDataSlice';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const screenWidth = Dimensions.get('window').width;
const screenHight = Dimensions.get('window').height;

const Login: FC<LoginProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogin = async () => {
    if (email === '' || pass === '') {
      setError('Email or Password is empty');
      setAlert(true);
      setInterval(() => {
        setAlert(false);
      }, 2000);
      return;
    }
    await auth()
      .signInWithEmailAndPassword(email, pass)
      .then(userData => {
        // console.log(userData);

        firestore()
          .collection('Users')
          .doc(userData?.user?.uid)
          .get()
          .then(docSnap => {
            if (docSnap.exists) {
              console.log(docSnap.data());
              dispatch(setUser(docSnap.data()));
            }
          });
      })
      .catch(err => {
        console.log(err.code);
        if (err.code.includes('invalid-credential')) {
          setError('Email or Password is incorrect');
          setAlert(true);
        } else if (err.code.includes('invalid-email')) {
          setError('Email is incorrect');
          setAlert(true);
        } else if (err.code.includes('network-request-failed')) {
          setError('Check Your Internet Connection, it is so slow');
          setAlert(true);
        }

        setTimeout(() => {
          setAlert(false);
        }, 2000);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={Bg} style={styles.img} resizeMode="cover" />
      <View style={styles.FormContainer}>
        {/* Icon */}
        <Image source={logo} resizeMode="cover" style={styles.logo} />
        {/* Text */}
        <Text style={styles.txt}>Welcom Back</Text>

        {/* Error Message */}
        {alert && (
          <Text style={{color: 'red', fontSize: 15, marginBottom: -30}}>
            {error}
          </Text>
        )}

        <View style={styles.SmallFormContainer}>
          {/* Email */}
          <UserTextInput
            setStateValue={setEmail}
            placeholder="Email"
            onChangeText={value => setEmail(value)}
          />
          {/* Password */}
          <UserTextInput
            setStateValue={setPass}
            placeholder="Password"
            onChangeText={value => setPass(value)}
          />
          {/* Button */}
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.txtBtn}>Sign In</Text>
          </TouchableOpacity>
          {/* Go to Sign up Form */}
          <View style={styles.lastTxt}>
            <Text style={styles.noAccounttxt}>Don't have an account?</Text>
            <TouchableOpacity
              style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-end',
                marginLeft: 10,
              }}
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text style={[styles.noAccounttxt, {color: '#056526'}]}>
                Create One!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -1,
  },

  img: {
    width: screenWidth,
    height: screenHight / 2,
  },
  FormContainer: {
    width: screenWidth,
    height: screenHight,
    backgroundColor: 'white',
    borderTopLeftRadius: 90,
    marginTop: -screenHight / 3.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  logo: {
    width: 48,
    height: 55,
    marginTop: 30,
  },
  txt: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    fontFamily: 'Jost',
    color: '#555555',
  },
  SmallFormContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  btn: {
    backgroundColor: '#04c651',
    margin: 20,
    width: '75%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Jost',
    marginTop: 10,
    marginBottom: 10,
  },
  lastTxt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '95%',
  },
  noAccounttxt: {
    marginTop: 20,
    color: '#555555',
    fontSize: 16,
    fontFamily: 'Jost',
    fontWeight: 'bold',
  },
});

/*

theme:{
    extends:{
    colors:{
      primary: '#04c651',
      secondary: '#056526',
      tertiary: '#555'

  }
}
}
*/
