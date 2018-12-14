import React, { Component } from 'react'
import { WebView, TouchableOpacity, Image, AsyncStorage, Text, StyleSheet, View, Platform, Dimensions, Linking} from 'react-native'
import Api from '../libs/api'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import GLOBAL from '../libs/global'


const TEMPLATE_HTML_BEGIN = '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"></head><body>';
const TEMPLATE_HTML_END = '</body></html>';

var width = Dimensions.get('window').width; //full width

export default class MsjDetail extends Component {

  componentDidMount() {
    try{
        AsyncStorage.getItem('user').then((value) => {
            if(value !== null){
                const user = JSON.parse(value);
                if (this.props.mensaje){
                  const ID_MARK = this.props.mensaje.message_id;
                    this.markOpenNotification(user.token, ID_MARK);
                    this.setState({token: user.token});
                }
            }
        });
    }catch(err){
        console.log(err);
    }
}

goInbox(){
  Actions.inbox();
}
  
  markOpenNotification(token,id) {
    //console.log('--markOpenNotification--', {token,id});
    const data = {message_id: id, token : token };
    return Api.post('/messages/markopenmessage', data)
        .then( resp => {
        })
        .catch( error => {
            console.log('error return',error);
        } )
  }



  render() {

    extraContent = null
    //imagen
    if(this.props.mensaje.message_type == 2){
      extraContent = <View>
       <Image
          style={{width: 320, height: 320}}
          source={{uri: this.props.mensaje.photo_path}}
        />
      </View>
    }
    //video
    else if(this.props.mensaje.message_type == 3){
      extraContent = <View style={{ height: 270 }}>
      <WebView
        source={{html: TEMPLATE_HTML_BEGIN+
          '<iframe width="100%" height="250" src="'+
          this.props.mensaje.url
          +'" frameborder="0" allowfullscreen></iframe>'
          +TEMPLATE_HTML_END }}
        mixedContentMode={'always'}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        automaticallyAdjustContentInsets={false}
        /></View>
 
    }
    //link
    else if(this.props.mensaje.message_type == 4){
      extraContent = <View>
        <TouchableOpacity style={styles.btnContainer} onPress={() => Linking.openURL(this.props.mensaje.url) }>
                <Text style={styles.btnText}>Abrir enlace</Text>
            </TouchableOpacity>
      </View>

    }

    return (
      <View style={styles.container}>
        <View style={styles.msjBox}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}> {this.props.mensaje.title} </Text>
          </View>
          <Text style={styles.sender}> Enviado por {this.props.mensaje.sender} el {this.props.mensaje.date} </Text>
          <Text style={styles.content}> {this.props.mensaje.content} </Text>
          {extraContent} 
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    msjBox:{
      backgroundColor: GLOBAL.COLOR.WHITE,
      borderRadius: 10,
      padding: 10,
      marginLeft: 10,
      marginVertical: 20,
      width: width-20,
    },
    titleWrapper:{
      borderBottomWidth: 1,
      borderBottomColor: GLOBAL.COLOR.GREEN,
      marginBottom: 5,
    },
    title:{
      fontSize: 16,
      paddingVertical: 5,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 3,
      color: GLOBAL.COLOR.BLACK,
    },
    sender:{
      fontSize: 12,
      color: GLOBAL.COLOR.GRAY,
    },
    content:{
      paddingTop: 10,
      textAlign: 'justify',
      marginBottom: 10,
    },
    btnContainer:{
      marginTop:10,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: GLOBAL.COLOR.GREEN,
      width: 200,
    },
    btnText: {
      color: GLOBAL.COLOR.WHITE,
      textAlign: 'center',
      justifyContent: 'center',
      fontWeight: '700'
    }
})
