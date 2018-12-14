import { Dimensions, Platform } from 'react-native'
// import Moment from 'moment';
import app_package from '../../package.json'

module.exports = {
    COLOR: {
        BACKGROUND_COLOR: "#E6E8EF",
        DARKGRAY: "#333333",
        GRAY: "#747474",
        GREEN: "#03C350",
        WHITE: '#FFFFFF',
        DISABLEDGRAY: '#909093',
        BLACK: '#000000',
        DARKBLUE: '#003F81',
        BLUE: '#0081D6',

    },
    DEVICE: {
        WIDTH:  Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height
    },
    //  DATETIME: {
    //      CURRENT: Moment()
    //  },
    // LOGO:{
    //     IDEAUNO: true,
    //     NEGRO: false
    // },
    // FONT:{
    //     COLOR: Platform.OS === "ios" ? "#34495e" : "#34495e" ,
    //     FAMILY: "IBMPlexSans-Text",
    //     FAMILY_BOLD: "IBMPlexSans-Bold"
    // },
    HOST: {
        // NAME: 'https://intranetccu.cl', // Copiar en NAME el servidor a ocupar para API
        // NAME: 'http://192.168.0.51', // Copiar en NAME el servidor a ocupar para API
         NAME: 'https://intranet.i1.cl', // Copiar en NAME el servidor a ocupar para API
    },
    MACHINE: {
        //IP: '192.168.0.4'
        IP: '192.168.1.148'
    },
    VERSION: app_package.version
}