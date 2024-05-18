import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';

import {RootStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {RootState} from '../context/store';
import {styles as styles2} from './Home';
import firestore from '@react-native-firebase/firestore';

type AddToChatProps = NativeStackScreenProps<RootStackParamList, 'AddToChat'>;

const screenHight = Dimensions.get('window').height;

const AddToChat = ({navigation}: AddToChatProps) => {
  const userData = useSelector((state: RootState) => state.getUserData?.user);
  const [AddChat, setAddChat] = useState('');

  const createNewChat = async () => {
    let id = `${Date.now()}`;

    const _doc = {
      _id: id,
      user: userData,
      chatName: AddChat,
    };
    if (AddChat !== '') {
      firestore()
        .collection('Chats')
        .doc(id)
        .set(_doc)
        .then(() => {
          setAddChat('');
          navigation.replace('Home');
        })
        .catch(error => {
          console.log('Error in creating Chat: ', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.greenContainer}>
        <View style={styles.greenContainerHead}>
          <Icon
            name="chevron-left"
            size={40}
            color={'white'}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={styles2.avatar}>
            <Image
              source={{uri: userData?.profilePIC}}
              style={styles2.avatarImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 20,
            marginTop: 30,
          }}>
          <View style={styles.IconsContainer}>
            {/* Icon#1 */}
            <Icon2 name="chatbubbles" size={28} color={'#777'} />
            {/* Text Input */}
            <TextInput
                
              value={AddChat}
              onChangeText={text => setAddChat(text)}
              style={styles.input}
              placeholder="Search or Create a chat"
            />
            {/* Icon#2 */}
            <Icon3
              name="send"
              size={28}
              color={'#777'}
              onPress={createNewChat}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChat;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:'flex-end',
    // alignItems:'center'
  },
  greenContainer: {
    width: '100%',
    flex: 0.3,
    backgroundColor: '#04c651',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  greenContainerHead: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    marginTop: -screenHight / 8 ,
  },
  IconsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#999',
  },
});
