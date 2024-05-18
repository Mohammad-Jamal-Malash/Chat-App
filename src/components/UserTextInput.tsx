import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect,useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


const UserTextInput = ({setStateValue, ...props}:{setStateValue : Function} & TextInputProps) => {
  const [isPass, setIsPass] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [isValidate,setIsValid] = useState(false); 
  const [userInputValue,setUserInputValue] = useState("");
  
  useEffect(() => {
    if (props.placeholder === 'Password') {
      setIsPass(true);
      
    }
    if (props.placeholder === 'Email') {
     
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const status = emailRegex.test(userInputValue as string);
        setIsValid(status);
        console.log(isValidate);
      }
    
    
  }, [userInputValue]);

  
  const handleText = (text : string)=>{
    setUserInputValue(text);
    setStateValue(text);
  }


  const Icons = (placeholder: string | undefined) => {
    switch (placeholder) {
      case 'Email':
        return 'envelope';
      case 'Password':
        return 'lock';
      case 'Full Name':
        return 'user';
      default:
        return 'user';
    }
  };

  return (
    
      <View style={[styles.container,

        {borderColor: !isValidate && props.placeholder === 'Email' ? 'red' : '#6c6d83'},
      ]}>
        <Icon
          name={Icons(props.placeholder)}
          size={20}
          color="#6c6d83"
          style={styles.Icon}
        />
        <TextInput
          {...props}
          style={styles.input}
          onChangeText={handleText}
          secureTextEntry={isPass && !showPass}
        />
        {isPass && (
          <TouchableOpacity
            onPress={() => {
              setShowPass(!showPass);
            }}>
            <Icon
              name={showPass ? 'eye' : 'eye-slash'}
              size={20}
              color="#6c6d83"
              style={styles.Icon}
            />
          </TouchableOpacity>
        )}
      </View>
  
  );
};

export default UserTextInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
   
    width: '95%',
    padding: 5,
    margin: 5,
  },

  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  Icon: {
    padding: 10,
  },
});
