import React, { Component } from 'react'
import { ActivityIndicator, Alert, AsyncStorage, StyleSheet, View, Text } from 'react-native'
import Api from '../libs/api'
import NewMsj from './NewMsj'
import _ from 'lodash';
import { Actions } from 'react-native-router-flux'
import GLOBAL from '../libs/global'


export default class Inbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageAlert: '',
            notifications: [],
            showSpinner: true,
            token: null,
            loggedIn: null,
        }
    }

    componentDidMount(){
        console.log('cargo inbox component')
        try{
         AsyncStorage.getItem('user').then((value) => {
             if(value !== null){
                 const user = JSON.parse(value);
                 this.setState({ token: user.token });
                 this.getNotifications({token: user.token});
             }else{
               this.setState({ loggedIn: false, showSpinner: false, messageAlert: 'Error al encontrar sesión'}, () => this.onAlert() );
             }
         });
        }catch(err){
            console.log(err);
            this.setState({ loggedIn: false, showSpinner: false, messageAlert: 'Error al encontrar sesión'}, () => this.onAlert() );
        }
   }

    getNotifications(token = 'nada') {
        //const TOKEN = token=='nada' ? this.state.token : token;
        const data = {token: token};
        return Api.post('/messages/messagessent', token)
        .then( resp => {
            //console.log(resp.data.messages);
            if(_.isUndefined(resp.data) || resp.data.code == 404){
                   this.setState({showSpinner: false, messageAlert: 'Error al encontrar notificaciones. Inténtelo más tarde.'}, () => this.onFailAlert());
            }else{
                this.setState({
                    notifications: resp.data.messages,
                    showSpinner: false
                });

            }
        })
        .catch( error => {
            console.log(error);
            this.setState({showSpinner: false, messageAlert: 'Error al encontrar notificaciones. Inténtelo más tarde.'}, () => this.onAlert());
        } )
    }

    onFailAlert(){
        Alert.alert(
            'Ha ocurrido un error',
            this.state.messageAlert,
            [
            {text: 'OK', onPress: () => console.log('') },
            ],
        )
    }
    onAlert(){
        Alert.alert(
            'Ha ocurrido un error',
            this.state.messageAlert,
            [
              {text: 'OK', onPress: () => Actions.login() },
            ],
          )
    }

  render() {
    return (
        <View style={styles.container}>
            {
            this.state.showSpinner ? <View style={styles.spinner}><ActivityIndicator size="large" color={GLOBAL.COLOR.GREEN} /></View> : 
                this.state.notifications.length > 0 ? 
                    this.state.notifications.map((mensaje) => {return <NewMsj key={mensaje.message_id} mensajeData={mensaje}/>} ) 
                : <Text style={styles.noNotifications}>No tienes notificaciones </Text>}
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: GLOBAL.COLOR.BACKGROUND_COLOR,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    spinner: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 340,
    },
    noNotifications : {
        flexDirection: 'row',
        justifyContent: 'center',
        width: 340,
        textAlign: 'center',
    }
  })
