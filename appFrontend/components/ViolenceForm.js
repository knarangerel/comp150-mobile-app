import React from 'react'
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert, Image, ScrollView, KeyboardAvoidingView
} from 'react-native';
import t from 'tcomb-form-native';

const Form = t.form.Form;
const FormContent = t.struct({
  location: t.String,
  description: t.String,
});

const options = {
  fields: {
    description: {
      multiline: true,
      stylesheet: {
        ...Form.stylesheet,
        textbox: {
          ...Form.stylesheet.textbox,
          normal: {
            ...Form.stylesheet.textbox.normal,
            height: 150
          },
          error: {
            ...Form.stylesheet.textbox.error,
            height: 150
          }
        }
      }
    }
  }
}

class ViolenceForm extends React.Component{

  componentWillMount() {
    this.setState({
      success: false
    })
  }

  submitForm = () => {
    const {photoURI} = this.props;
    const formData = new FormData();
    formData.append('image', {uri: photoURI, name: 'image.jpg', type: 'image/jpeg'});

    const options = {
      method: 'POST',
      body: formData,
      // If you add this, upload won't work
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };

    delete options.headers['Content-Type'];

    fetch('https://comp150.herokuapp.com/uploadImage?uid=1234', options).then(
      () => this.setState({success:true})
    );

  }

  render() {
    const {photoURI} = this.props;
    const {success} = this.state;

    if (success){
      return(
        <View  style={{flex:1}}>
          <Text>SUCCESS</Text>
        </View>
      )
    }
    return(
      <View style={{flex:1}}>
        {photoURI !== '' ?
          <View style={{flex:1}}>
            <Image
              source={{uri: photoURI}}
              style={{
                flex: 1,
                transform:[{scale:0.5}]
              }}
            />
          </View>: <View/>}
        <KeyboardAvoidingView style={{flex:1, marginTop:20, paddingLeft:5, paddingRight:5}} behavior="padding" enabled>
          <ScrollView>
            <Form
              type={FormContent}
              options={options}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={{marginBottom:10}}>
          <Button onPress={this.submitForm} title='submit'/>
        </View>
      </View>
    )


  }
}

export default ViolenceForm;