import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {Bg, logo} from '../assets/index';
import UserTextInput from '../components/UserTextInput';
import {avatars} from '../../utils/supports';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

type SignUpProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const screenWidth = Dimensions.get('window').width;
const screenHight = Dimensions.get('window').height;



const SignUp: FC<SignUpProps> = ({navigation}): React.JSX.Element => {
  const [avatar, setAvatar] = useState(avatars[0].image.asset.url);
  const [AvatarMenu, setAvataeMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fullName, setFullNsme] = useState("");


  const handelSignUp = async () => {
    console.log('The Email and pass', email, pass);
    await auth()
      .createUserWithEmailAndPassword(email,pass)
      .then(
        user => {
          console.log('User account created & signed in!');
          const data = {
          _id : user?.user.uid,
          fullName: fullName,
          profilePIC: avatar,
          providerData: user.user.providerData[0]
          }
          firestore().collection("Users").doc(user?.user.uid).set(data).then(
            ()=>{
              navigation.navigate("Login");
            }
          );
        },
        error => {
          console.error(error);
        },
      );
  };

  return (
    
      <View style={styles.container}>
        <Image source={Bg} style={styles.img} resizeMode="cover" 
        />
        {AvatarMenu && (
          <View style={styles.listOfAvatars}>
            <FlatList
              style={styles.absolute}
              data={avatars}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[styles.avatar, {margin: 15}]}
                  onPress={() => {
                    setAvatar(item.image.asset.url);
                    setAvataeMenu(false);
                  }}>
                  <Image
                    source={{uri: item.image.asset.url}}
                    resizeMode="contain"
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        <View style={styles.FormContainer}>
          {/* Icon */}
          <Image source={logo} resizeMode="cover" style={styles.logo} />
          {/* Text */}
          <Text style={styles.txt}>Join with us!</Text>

          {/* avatar*/}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={() => {
                setAvataeMenu(true);
              }}
              style={styles.avatar}>
              <Image
                source={{uri: avatar}}
                resizeMode="contain"
                style={styles.avatarImage}
              />
              <View style={styles.pincel}>
                <Icon name="pencil" size={18} color={'#fff'} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.SmallFormContainer}>
            {/* User Name */}
            <UserTextInput placeholder="Full Name"
            setStateValue={setFullNsme}
            />

            {/* Email */}
            <UserTextInput placeholder="Email"
            setStateValue={setEmail} />

            {/* Password */}
            <UserTextInput placeholder="Password"
            setStateValue={setPass} />

            {/* Button */}
            <TouchableOpacity style={styles.btn} onPress={handelSignUp}>
              <Text style={styles.txtBtn}>Sign Up</Text>
            </TouchableOpacity>
            {/* Go to Sign up Form */}
            <View style={styles.lastTxt}>
              <Text style={styles.noAccounttxt}>Have an account! </Text>
              <TouchableOpacity
                style={{
                  alignSelf: 'stretch',
                  justifyContent: 'flex-end',
                  marginLeft: 10,
                }}
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text style={[styles.noAccounttxt, {color: '#056526'}]}>
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    
  );
};

export default SignUp;

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
    marginTop: 10,
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
    color: '#555555',
    fontSize: 16,
    fontFamily: 'Jost',
    fontWeight: 'bold',
  },

  avatarContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 82,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: '#04c651',
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    // padding: 1,
  },
  avatarImage: {
    width: 79,
    height: 79.5,
    padding: 1,
  },
  pincel: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#04c651',
    borderRadius: 10,
  },
  listOfAvatars: {
    position: 'absolute',
    zIndex: 6,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    padding: 6,
    flex: 1,
    alignSelf: 'center',
    marginLeft: '15%',
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
