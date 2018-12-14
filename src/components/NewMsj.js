import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableHighlight, Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions } from 'react-native-router-flux'
import GLOBAL from '../libs/global'

var width = GLOBAL.DEVICE.WIDTH //full width

export default class NewMsj extends Component {
  render() {
      
    var open_status = this.props.mensajeData.open
    var icono;
    if (open_status) {
        icono = <Icon name="envelope-open" color={GLOBAL.COLOR.DISABLEDGRAY} size={20}/>
    }
    else {
        icono =<Icon name="envelope" color={GLOBAL.COLOR.GREEN} size={20}/>
    }

    const styles = StyleSheet.create({
        msjBox:{
            backgroundColor: GLOBAL.COLOR.WHITE,
            borderRadius: 10,
            padding: 10,
            marginLeft: 10,
            marginVertical: 5,
            width: width-20,
            height: 60,
            justifyContent: 'center',
        },
        wrapper:{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between'
        },
        iconWrapper:{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 6,
            width: 40,
            flexShrink:0
        },
        textWrapper:{
            paddingHorizontal: 5,
            flex:1
        },
        title:{
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: 3,
            color: open_status ? GLOBAL.COLOR.DISABLEDGRAY : GLOBAL.COLOR.BLACK ,
        },
        sender:{
            fontSize:11,
            color: GLOBAL.COLOR.DISABLEDGRAY
        },
        dateWrapper:{
            borderLeftWidth: 3,
            borderLeftColor: open_status ? GLOBAL.COLOR.DISABLEDGRAY : GLOBAL.COLOR.GREEN,
            alignItems: 'center',
            justifyContent: 'center',
            width: 45,
            flexShrink:0,
        },
        date: {
            paddingLeft: 10,
            color: open_status ? GLOBAL.COLOR.DISABLEDGRAY : GLOBAL.COLOR.BLACK,
        },
    
    
    })

    return (
      <View>
            <TouchableHighlight style={styles.msjBox} onPress={() => Actions.ver_mensaje({mensaje: this.props.mensajeData})}>
                <View style={styles.wrapper}>
                    <View style={styles.iconWrapper}>{icono}</View>
                    <View style={styles.textWrapper}>
                        <Text style={styles.title}>{this.props.mensajeData.title} </Text>
                        <Text style={styles.sender}> Enviado por {this.props.mensajeData.sender}  </Text>
                    </View>
                    <View style={styles.dateWrapper}>
                        <Text style={styles.date}>{String(this.props.mensajeData.date).split(' ')[0] } </Text>
                    </View>
                </View>
            </TouchableHighlight>
      </View>
    )
  }
}


