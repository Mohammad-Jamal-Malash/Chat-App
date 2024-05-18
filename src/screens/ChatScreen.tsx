import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useRef, useState, useLayoutEffect} from 'react';

import {RootStackParamList} from '../App';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {styles as HomeStyles} from './Home';
import {styles as AddToChartStyles} from './AddToChat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../context/store';
import firestore from '@react-native-firebase/firestore';
import {DocumentData} from 'firebase/firestore';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'chatScreen'>;

const ChatScreen = ({route}: ChatScreenProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const {room}: any = route.params;
  const userData = useSelector((state: RootState) => state.getUserData?.user);
  const [message, setmessage] = useState('');
  const [Messages, setMessages] = useState([] as DocumentData[]);
  const textInputRef = useRef<TextInput>(null);

  const handleKeyBoardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMesssage = async () => {
    const timeStamp = firestore.FieldValue.serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomID: room._id,
      timeStamp: timeStamp,
      message: message,
      user: userData,
    };
    setmessage('');
    await firestore()
      .collection('Chats')
      .doc(room._id)
      .collection('messages')
      .doc(id)
      .set(_doc)
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
  };
  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('Chats')
      .doc(room._id)
      .collection('messages')
      .orderBy('timeStamp', 'asc')
      .onSnapshot(querySnapShot => {
        const UpdatedMessage = querySnapShot.docs.map(doc => doc.data());
        setMessages(UpdatedMessage);
        setIsLoading(false);
        // console.log('UpdatedMessage', UpdatedMessage);
      });

    // to stop listening to changes
    // return () => subscriber();
    return subscriber;
  }, []);
  return (
    <View style={AddToChartStyles.container}>
      <View style={AddToChartStyles.greenContainer}>
        <View style={styles.greenContainerHead}>
          <Icon
            name="chevron-left"
            size={40}
            color={'white'}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View
            style={[
              HomeStyles.ChatImageContainer,
              {
                width: 55,
                height: 55,
                borderColor: 'white',
                marginHorizontal: -15,
              },
            ]}>
            <Icon2 name="users" size={24} color={'white'} />
          </View>

          <View>
            <Text style={styles.txt}>
              {room.chatName.length > 16
                ? `${room.chatName.slice(0, 13)}..`
                : room.chatName}
            </Text>
            <Text style={[styles.txt, {fontSize: 12}]}>online</Text>
          </View>
          <Icon2 name="video" size={22} color={'white'} />
          <Icon3 name="phone" size={22} color={'white'} />
          <Icon4 name="dots-three-vertical" size={22} color={'white'} />
        </View>
      </View>
      <View
        style={[AddToChartStyles.body, {paddingTop: 30, paddingVertical: 15}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
          style={styles.keyBoardViewStyle}>
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View style={HomeStyles.ActivityIndicatorStyle}>
                    <ActivityIndicator size={'large'} color={'#43C651'} />
                  </View>
                </>
              ) : (
                <>
                  {/* Chat */}
                  {Messages.map((msg, index) =>
                    msg.user?.providerData?.email ===
                    userData?.providerData?.email ? (
                      <View key={index} style={{margin: 5}}>
                        <View style={styles.msgContainer}>
                          <Text style={styles.txtMsg}>{msg.message}</Text>
                        </View>
                        <View style={{alignSelf: 'flex-end'}}>
                          <Text style={styles.timeTxt}>
                            {' '}
                            {new Date(
                              parseInt(msg?.timeStamp?.seconds) * 1000,
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        key={index}
                        style={{
                          margin: 5,
                          alignSelf: 'flex-start',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={styles.msgContainerSender}>
                          {/* Image */}
                          <Image
                          style = {styles.SenderImage} 
                          source={{uri: msg.user.profilePIC}} />
                          {/* Text */}

                          <View  style={{margin: 5}}>
                        <View style={styles.SenderTextContainer}>
                          <Text style={[styles.txtMsg,{color:'black'}]}>{msg.message}</Text>
                        </View>
                        <View style={{alignSelf: 'flex-start'}}>
                          <Text style={styles.timeTxt}>
                            {' '}
                            {new Date(
                              parseInt(msg?.timeStamp?.seconds) * 1000,
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </Text>
                        </View>
                      </View>
                        </View>
                      </View>
                    ),
                  )}
                </>
              )}
            </ScrollView>
            <View style={styles.bottomSection}>
              <View style={styles.inputContainer}>
                <Icon4
                  name="emoji-happy"
                  size={24}
                  color={'gray'}
                  onPress={handleKeyBoardOpen}
                />
                <TextInput
                  ref={textInputRef}
                  style={{
                    flex: 1,
                    fontWeight: '500',
                  }}
                  placeholder="Type here..."
                  placeholderTextColor={'#999'}
                  value={message}
                  onChangeText={text => setmessage(text)}
                />
                <Icon4 name="mic" size={24} color={'#04c651'} />
              </View>
              <Icon3
                name="send"
                size={24}
                color={'gray'}
                style={{
                  alignSelf: 'center',
                  paddingBottom: 10,
                }}
                onPress={sendMesssage}
              />
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  greenContainerHead: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  txt: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    // marginLeft:10,
    textTransform: 'capitalize',
  },
  keyBoardViewStyle: {
    flex: 1,
  },
  bottomSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  msgContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#04c651',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: 'auto',
    position: 'relative',
    alignSelf: 'flex-end',
  },
  txtMsg: {
    color: 'white',
    fontWeight: '500',
  },
  timeTxt: {
    color: 'black',
    fontWeight: '600',
    fontSize: 12,
  },
  msgContainerSender: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SenderImage:{
    width:55,
    height:55,
    borderWidth:2,
    borderColor:'#04c651',
    borderRadius:30,
  },
  SenderTextContainer:{
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#D5D5D5',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: 'auto',
    
  }
});
