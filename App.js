/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {Platform, StyleSheet} from 'react-native';
import MenuRouter from './src/scenes/MenuRouter';
import OneSignal from 'react-native-onesignal'; 
import Api from './src/libs/api';
import { Actions } from 'react-native-router-flux';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: null
        }

        OneSignal.init("65b56b21-e92a-4911-b70b-3306af308adc", {kOSSettingsKeyAutoPrompt : true});
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        OneSignal.configure();
      }

      onReceived(notification) {
        console.log("Notification received: ", notification);
        //console.log("Notification received: ", notification.payload.additionalData);
        //const data = {message_id: notification.payload.additionalData.message_id };
        const data = {message_id: notification.payload.additionalData.message_user_id};
        return Api.post('/messages/markreceivedmessage', data)
            .then( resp => {
            //console.log('return_received: ', resp);  
            })
            .catch( error => {
                console.log('error return: ',error);
            } );
      }
    
      onOpened(openResult) {
        // console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        // console.log('isActive: ', openResult.notification.isAppInFocus);
        // console.log('openResult: ', openResult);
        Actions.ver_mensaje({mensaje: openResult.notification.payload.additionalData
        });
      }
    
      onIds(device) {
        console.log('Device info: ', device);
      }


    render() {
        return (
            <MenuRouter />
        );
    }
}