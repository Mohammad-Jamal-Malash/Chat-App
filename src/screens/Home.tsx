import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';

import {RootStackParamList} from '../App';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../context/store';

import {logo} from '../assets/index';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

import firestore from '@react-native-firebase/firestore';
import {DocumentData} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({navigation}: HomeProps) => {
  const userData = useSelector((state: RootState) => state.getUserData?.user);
  // console.log("Am in the Home Screen this is the user Data: ",  userData);
  const [isLoading, setIsLoading] = useState(true);
  const [chat, setChat] = useState([] as DocumentData[]);

  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('Chats')
      .orderBy('_id', 'desc')
      .onSnapshot(querySnapShot => {
        const chatRooms = querySnapShot.docs.map(doc => doc.data());
        setTimeout(() => {
          setChat(chatRooms);
          setIsLoading(false);
        }, 1000);
      });
    // to stop listening to changes
    return () => subscriber();
    // return subscriber;
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Head Section */}
        <View style={styles.headSection}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity 
          onPress={() => {
            navigation.navigate('ProfileScreen');
          }}  
          style={styles.avatar}>
            <Image
              source={{uri: userData?.profilePIC}}
              resizeMode="cover"
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
        {/* Body Section */}
        {/* Scroll View Section */}
        <ScrollView collapsable={true} style={styles.ScrollSection}>
          <View style={styles.ScrollSectionHead}>
            <Text style={styles.txt}>Messages</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddToChat');
              }}>
              <Icon name="chatbox" size={35} color={'gray'} />
            </TouchableOpacity>
          </View>
          {/* Messages Section */}

          {isLoading ? (
            <View style={styles.ActivityIndicatorStyle}>
              <ActivityIndicator size={'large'} color={'#43C651'} />
            </View>
          ) : chat.length === 0 ? (
            <Text
            style = {{
              textAlign: 'center',
              marginTop: 50,
              fontSize: 20,
              color: '#43C651',
              
            }}
            > There is No Chats Yet!!</Text>
          ) : (
            <>
              {chat.map(room => {
                return <MessageCard key={room._id} room={room} />;
              })}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({room}: DocumentData) => {
  // be sure to import the correct navigation prop
  // the one from @react-navigation/native-stack
  // it is named NativeStackNavigationProp
  // not NativeStackScreenProps
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('chatScreen', {room: room});
      }}
      style={styles.messageContainer}>
      {/* Image */}
      <View style={styles.ChatImageContainer}>
        <Icon2 name="users" size={30} />
      </View>

      {/* Message Content */}
      <View style={styles.txtCard}>
        <Text style={styles.messageTitle}>{room.chatName}</Text>
        <Text>
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to....
        </Text>
      </View>

      {/* Time Text */}
      <Text style={styles.Timetxt}>27m</Text>
    </TouchableOpacity>
  );
};

export default Home;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#04c651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  ScrollSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: -10,
  },
  ScrollSectionHead: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    marginTop: 20,
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  ActivityIndicatorStyle: {
    marginTop: 50,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
  },
  ChatImageContainer: {
    width: 62,
    height: 62,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#04c651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtCard: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },
  messageTitle: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  Timetxt: {
    color: '#04c651',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
});
