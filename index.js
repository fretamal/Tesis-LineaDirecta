/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Reactotron from 'reactotron-react-native';
import GLOBAL from './src/libs/global'

Reactotron
  //.configure({host: '192.168.1.148'}) // controls connection & communication settings
  //.configure({host: GLOBAL.MACHINE.IP}) // controls connection & communication settings
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!


AppRegistry.registerComponent(appName, () => App);
