import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import Tflite from 'tflite-react-native'

const tflite = new Tflite()
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const blue = '#25d5fd'

const modelFile = 'models/yolov2_tiny.tflite'
const labelsFile = 'models/yolov2_tiny.txt'

export default class App extends Component {
  state = {
    imageHeight: height,
    imageWidth: width,
    recognitions: [],
    tempImage: ''
  }

  componentDidMount(): void {
    tflite.loadModel({
        model: modelFile,
        labels: labelsFile,
        fixOrientation: true,
        forceUpOrientation: true
      },
      (err, res) => {
        if (err)
          console.log(err)
        else
          console.log(res)
      })
  }

  componentWillUnmount(): void {
    tflite.close()
  }

  renderBoxes() {
    const { recognitions, imageHeight, imageWidth } = this.state
    return recognitions.map((res, id) => {
      const width = res['rect']['w'] * imageHeight
      const height = res['rect']['h'] * imageWidth
      const left = res['rect']['x'] * imageHeight
      const top = res['rect']['y'] * imageWidth
      console.log(res['detectedClass'], left, top, width, height)
      return (
        <View key={id}>
          <Text style={{ color: 'white', fontSize: 14, position: 'absolute', top, left }}>
            {res['detectedClass'] + ' ' + (res['confidenceInClass'] * 100).toFixed(0) + '%'}
          </Text>
          <View style={[styles.box, { top, left, width, height }]}/>
        </View>
      )
    })
  }

  takePicture = async() => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        orientation: 'portraitUpsideDown'
      }
      const data = await this.camera.takePictureAsync(options)
      console.log(data)
      tflite.detectObjectOnImage({
          path: data.uri,
          model: 'YOLO',
          imageMean: 0.0,
          imageStd: 255.0,
          threshold: 0.4,
          numResultsPerClass: 1
        },
        (err, res) => {
          if (err)
            console.log(err)
          else {
            console.log(res)
            this.setState({ recognitions: res, tempImage: data.uri })
          }
        })
    }
  }

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref
        }}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel'
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel'
        }}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        style={{
          flex: 1
        }}
      >
        <View style={styles.boxes}>
          {this.renderBoxes()}
        </View>
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 20, right: 20 }}
          onPress={() => {this.takePicture()}}
        >
          <Text> SNAP </Text>
        </TouchableOpacity>
      </RNCamera>
    )
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  box: {
    position: 'absolute',
    borderColor: blue,
    borderWidth: 1
  },
  boxes: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
})
