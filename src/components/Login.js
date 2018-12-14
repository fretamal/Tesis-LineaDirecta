import React, { Component } from 'react'
import { Alert, ActivityIndicator, AsyncStorage, ImageBackground, Platform, Text, StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import OneSignal from 'react-native-onesignal'
import Icon from 'react-native-vector-icons/FontAwesome'
import Api from '../libs/api'
import GLOBAL from '../libs/global'
import _ from 'lodash';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
          email: '',
          password: '',
          messageAlert: '',
          loggedIn: false,
          user: null,
          idPushToken: null,
          spinnerLogin: false
        }
    }

    componentDidMount(){
        // apenas se abre la app setea el idPushToken en el localStorage con el metodo onIDs
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.configure();

        // revisa si estas logeado buscando al user en localStorage
         try{
             //console.log('reviso si hay user al montar login');
            AsyncStorage.getItem('user').then((value) => {
              if(value !== null){
                  this.setState({ loggedIn: true, user: JSON.parse(value)},() => Actions.main());
                  //console.log('si habia '+ value);
              }else{
                  this.setState({ loggedIn: false, user: null });
              }
          });
        }catch(err){
            this.setState({ loggedIn: false });
            console.log('1catch err ', err);
        }
    }
    
    componentWillUnmount() {
        OneSignal.removeEventListener('ids', this.onIds);
    }
    
    onIds = (device) => {
        AsyncStorage.setItem('idPushToken', JSON.stringify({token:  device.userId}));
    }
    
    async login(){
        
        let error_found = false

        if(_.isEqual(this.state.email,"")){
            error_found = true;
            this.setState({messageAlert: "Correo electrónico requerido"}, () => this.onAlert() );
        }

        if(_.isEqual(this.state.password,"")){
            error_found = true;
            this.setState({messageAlert: "Contraseña requerida"}, () => this.onAlert() );
        }

        //intenta obtener el idPush desde el local storage, si no esta lo deja null,
        //si esta lo asigna a la variable isPushToken
        await AsyncStorage.getItem('idPushToken').then((value) => {
                if(value !== null){
                    const token = JSON.parse(value);
                    this.setState({ idPushToken: token.token  });
                }else{
                    this.setState({ idPushToken: null  });
                }
        });

        //si el idPushToken es null hay problemas con onesignal
        if(_.isNull(this.state.idPushToken)){
            error_found = true;
            this.setState({messageAlert:  "Problema al obtener token del dispositivo, intenta más tarde"}, () => this.onAlert() );
        }

        if(!error_found){
            this.getLogin({email:this.state.email, password:this.state.password, idPushToken: this.state.idPushToken});
        }
    }
    
    getLogin(user) {

        this.setState({ spinnerLogin:true });
        return Api.post('/users/loginwebapp' ,user)
            .then( resp => {
                // si no hay respuesta del servido lanza error
                if(_.isUndefined(resp.data)){
                    this.setState({ messageAlert: 'Nombre de usuario o contraseña incorrectas' }, () => this.onAlert() );
                }else{
                    // si hay respuesta setea el token 
                    const token = resp.data.token;
                    this.setState({token:token});

                    //console.log('intenta setear el token');
                    try{
                        //console.log('revisa si ya hay user en el localStorage');
                        // revisa si ya hay user en el localStorage
                        AsyncStorage.getItem('user').then((value) => {
                            if(value !== null){
                                this.setState({ loggedIn: true, user: JSON.parse(value) }, () => Actions.main());
                                //console.log('no habia asique intento setearlo');

                            }else{
                                // si no hay user lo setea user=resp.data
                                //console.log('entra a setear el user en localstorage');
                                AsyncStorage.setItem('user',  JSON.stringify(resp.data) ).then(() => {
                                this.setState({ loggedIn: true, user: resp.data}, () => Actions.main());
                                });
                                //redirecciona?
                                
                            }
                        });
                    }catch(err){
                        console.log(err);
                        this.setState({ loggedIn: false });
                    }
                }
            })
            .catch( error => {
                console.log(error);
                this.setState({ messageAlert:"Ha ocurrido un error, intente de nuevo" }, () => this.onAlert() );
            } )

    }

    onAlert(){
        Alert.alert(
            'Ha ocurrido un error',
            this.state.messageAlert,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
          )
    }
    
    render() {
        return ( 
            <ImageBackground source={require('../images/bglogin.png')} style={{width: '100%', height: '100%'}} resizeMode='cover'>
                <KeyboardAvoidingView behavior="position"  enabled>
                    <View>
                        {this.state.loggedIn ? Actions.main() : null }
                        <View style={styles.logoContainer}>
                            <Image source={require('../images/logo.png')} style={{width: '80%', height: '80%'}} />
                        </View>
                        <View style={styles.formContainer}>
                            <View style={styles.inputWrapper}>
                                <View style={styles.icon}>
                                    <Icon name="user" color={GLOBAL.COLOR.WHITE} size={20}/>
                                </View>
                                <TextInput 
                                    style={styles.input}
                                    placeholderTextColor="#9BACB8"
                                    placeholder="Correo Electrónico"
                                    onSubmitEditing={() => this.passwordInput.focus()}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(text) => this.setState({email : text.trim() })}
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <View style={styles.icon}>
                                    <Icon name="lock" color={GLOBAL.COLOR.WHITE} size={20}/>
                                </View>
                                <TextInput 
                                    style={styles.input}
                                    placeholderTextColor="#9BACB8"
                                    placeholder="Contraseña"
                                    secureTextEntry={true}
                                    onChangeText={(text) => this.setState({password : text.trim() })}
                                    ref= {(input) => this.passwordInput = input}
                                />
                            </View>
                            
                            <TouchableOpacity style={styles.btnContainer} onPress={() => this.login()}>
                                {
                                    this.state.spinnerLogin ? 
                                        <ActivityIndicator size="small" color={GLOBAL.COLOR.WHITE} />
                                    : 
                                    <Text style={styles.btnText}> 
                                        <Text>Iniciar Sesion</Text>
                                    </Text>
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        //justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginTop: 50,        
    },
    logoText: {
        color: GLOBAL.COLOR.WHITE,
        fontSize: 40,
    },
    formContainer: {
        padding: 30,
    },
    inputWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9BACB8',
        height: 40,
        width: 40,
    },
    input: {
        height: 40,
        backgroundColor: GLOBAL.COLOR.WHITE,
        marginBottom: 40,
        paddingHorizontal: 10,
        width: 270,
    },
    btnContainer:{
        height: 50,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: GLOBAL.COLOR.GREEN,
        justifyContent: 'center',
    },
    btnText: {
        color: GLOBAL.COLOR.WHITE,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16,
    }

})

export default Login;