import React, { Component } from 'react'
import { Platform, Text, StyleSheet, View } from 'react-native'
import { Router, Scene, Actions } from 'react-native-router-flux'
import GLOBAL from '../libs/global'
import Icon from 'react-native-vector-icons/FontAwesome'
import Login from '../components/Login'
import Home  from '../components/Home'
import Inbox from '../components/Inbox'
import User from '../components/User'
import MsjDetail from '../components/MsjDetail'

export default class MenuRouter extends Component {

    onBackFunction()
    {
        //console.log("backkkkkkkkkk")
        Actions.main()
    }

    render() {
        
        return (
            <Router
                navigationBarStyle={styles.navStyle}
                titleStyle={styles.navTitleStyle}
            >
                <Scene 
                    key="root"
                    hideNavBar={true}
                >
                    <Scene
                        key="login"
                        component={Login}
                        title="Login"
                        hideNavBar={true}
                        initial                        
                    />
                    <Scene
                        key="main"
                        gesturesEnabled={false}
                        tabs
                        tabBarStyle={styles.tabsStyle}
                        labelStyle={styles.labelsStyle}
                        activeBackgroundColor={GLOBAL.COLOR.DARKBLUE}
                    >
                        <Scene
                            key="inbox"
                            component={Inbox}
                            title="Mensajes"
                            tabBarLabel="Mensajes"
                            icon={()=> (
                                <Icon name="envelope" color={GLOBAL.COLOR.WHITE} size={20}/>
                            )}
                            
                        />
                        {/* <Scene
                            key="home"
                            component={Home}
                            title="Inicio"
                            tabBarLabel="Inicio"
                            icon={()=> (
                                <Icon name="home" color={GLOBAL.COLOR.WHITE} size={25}/>
                            )}
                        /> */}
                        <Scene
                            key="user"
                            component={User}
                            title="Configuración"
                            tabBarLabel="Configuración"
                            icon={()=> (
                                <Icon name="cog" color={GLOBAL.COLOR.WHITE} size={25}/>
                            )}
                        />
                    </Scene>
                    <Scene
                        key="ver_mensaje"
                        component={MsjDetail}
                        title="Mensaje"
                        hideNavBar={false}
                        navBarButtonColor={GLOBAL.COLOR.WHITE}
                        back
                        onBack={() => this.onBackFunction() }
                    />
                </Scene>
            </Router>
        )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GLOBAL.COLOR.BLACK,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
    },
    navStyle: {
        backgroundColor: GLOBAL.COLOR.BLUE,
    },
    navTitleStyle: {
        color: GLOBAL.COLOR.WHITE,
    },
    labelsStyle:{
        color: GLOBAL.COLOR.WHITE,
    },
    tabsStyle: {
        backgroundColor: GLOBAL.COLOR.BLUE,
    }

})
  
