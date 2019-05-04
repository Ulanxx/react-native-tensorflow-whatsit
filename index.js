import { AppRegistry } from 'react-native'
import App from './src'
// import React, { Component } from 'react'
// import { View, Text } from 'react-native'
import { name as appName } from './app.json'

// class App extends Component {
//   render() {
//     return (
//       <View>
//         <Text>ssss</Text>
//       </View>
//     )
//   }
// }

AppRegistry.registerComponent(appName, () => App)
