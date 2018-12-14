import React, { Component } from 'react'
import { ActivityIndicator, Alert, AsyncStorage, Text, StyleSheet, View, Platform, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Api from '../libs/api'
import GLOBAL from '../libs/global'

var width = Dimensions.get('window').width; //full width

export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageAlert: '',
            token: null,
            loggedIn: null,
            showSpinner: false,
            user: [],
        }
    }

    componentDidMount(){
        //console.log('cargo index component')
        try{
         AsyncStorage.getItem('user').then((value) => {
             if(value !== null){
                 
                 const user = JSON.parse(value);
                 
                 this.setState({ 
                     user: user,
                     token: user.token 
                 }); 

             }else{
               this.setState({ 
                   loggedIn: false, 
                   showSpinner: false, 
                   messageAlert: 'Error al encontrar sesión'}, () => this.onAlert() );
               //Actions.login();
             }
         });
        }catch(err){
            console.log(err);
            this.setState({ loggedIn: false, showSpinner: false, messageAlert: 'Error al encontrar sesión' }, () => this.onAlert());
            //Actions.login();
        }
   }

    logout(){
        //console.log('Cerrar sesión');
        this.setState({ showSpinner:true });
        const data = {token : this.state.token };
        return Api.post('/users/logoutwebapp', data)
            .then( resp => {
                if(resp.data.status == 'OK'){
                    try{
                        AsyncStorage.getItem('user').then((value) => {
                        if(value !== null){
                            this.setState({user: false, loggedIn: false });
                            AsyncStorage.removeItem('user').then(() => {});
                        }
                        // redirecciona al login?
                        this.setState({messageAlert : 'La sesión ha sido cerrada correctamente'}, () => this.onSuccessAlert() );
                        //Actions.login() 
                        });
                    }catch(err){
                        console.log(err);
                    }
                }else{
                    this.setState({messageAlert : 'Error al cerrar sesión'}, () => this.onFailAlert() );
                }
            })
            .catch( error => {
                console.log('error return',error);
            } )

      }

        onSuccessAlert(){
            Alert.alert(
                'Sesión cerrada',
                this.state.messageAlert,
                [
                {text: 'OK', onPress: () => Actions.login() },
                ],
            )
        }

        onFailAlert(){
            Alert.alert(
                'Sesión cerrada',
                this.state.messageAlert,
                [
                {text: 'OK', onPress: () => Actions.main() },
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
        <View style={styles.msjBox}>
            <Image style={styles.profileImg} source={require('../images/user100x100.png')}/> 
            <View style={styles.titleWrapper}>
                <Text style={styles.name}> {this.state.user.name}</Text>
            </View>
            <Text style={styles.info}> Correo: {this.state.user.email} </Text>
            <TouchableOpacity style={styles.btnContainer} onPress={() => this.logout()}>
            {
                this.state.showSpinner ? 
                    <ActivityIndicator size="small" color={GLOBAL.COLOR.WHITE} />
                : <Text style={styles.btnText}>Cerrar Sesión</Text>
            }
            </TouchableOpacity>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    profileImg:{
        marginTop: 20,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: GLOBAL.COLOR.GREEN,
        borderRadius: 50,
    },
    titleWrapper:{
        borderBottomWidth: 1,
        borderBottomColor: GLOBAL.COLOR.GREEN,
        marginBottom: 5,
    },
    name:{
        fontSize: 18,
        paddingVertical: 0,
        fontWeight: '600',
        marginBottom: 3,
        color: GLOBAL.COLOR.BLACK,
      
    },
    userType:{
        color: GLOBAL.COLOR.GRAY,
        paddingBottom: 10,
        fontWeight: '600',
    },
    info:{
        color: GLOBAL.COLOR.GRAY,
        paddingTop: 10,

    },
    btnContainer:{
        marginTop: 60,
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
