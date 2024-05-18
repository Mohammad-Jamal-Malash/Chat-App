import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

import {RootStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../context/store';
import {setUserNull} from '../context/UserDataSlice/userDataSlice'
import {styles as AddToChatStyle} from './AddToChat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfileScreen'
>;

const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const UserData = useSelector((state: RootState) => state.getUserData?.user);
  const dispatch = useDispatch<AppDispatch>();
  const HandleLogout = async () => {
    await auth().signOut();
    dispatch(setUserNull());
    navigation.replace('Login');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 30,
          paddingVertical: 20,
          color: 'white',
          backgroundColor: '#04c651',
        }}>
        Profile Screen
      </Text>
      {/* Head section */}
      <View style={AddToChatStyle.greenContainerHead}>
        <MaterialIcons
          name="chevron-left"
          size={40}
          color={'gray'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <TouchableOpacity onPress={HandleLogout} style={styles.logoutBtn}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: 'white',
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Image source={{uri: UserData?.profilePIC}} style={styles.profilePic} />
      <View>
        <Text style={[styles.userDataTextStyle, {color: '#04c651'}]}>
          {UserData?.fullName}
        </Text>
        <Text style={styles.userDataTextStyle}>
          {UserData?.providerData?.email}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#04c651',
  },
  userDataTextStyle: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    fontFamily: 'Jost',
    color: '#555',
  },
  logoutBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#04c651',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
