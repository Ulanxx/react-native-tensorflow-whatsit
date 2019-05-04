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

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const tflite = new Tflite()

const Config = {
  model: {
    lite: 'models/yolov2_graph.lite',
    label: 'models/yolov2_graph.txt'
  },
  borderBox: {
    borderColor: '#FFFFFF',
    fontSize: 18,
    fontColor: '#FFFFFF',
    borderWidth: 2,
    compensation: 1.05
  }
}

export default class App extends Component {
  state = {
    imageHeight: height,
    imageWidth: width,
    recognitions: []
  }

  componentDidMount() {
    tflite.loadModel(
      {
        model: Config.model.lite,
        labels: Config.model.label,
        numThreads: 1
      },
      (err, res) => {
        if (err) console.log(err)
        else console.log(res)
      }
    )

    this.interval = setInterval(() => {
      this.clearDetect()
    }, 10000)
  }

  componentWillUnmount() {
    tflite && tflite.close()
    this.interval && clearInterval(this.interval)
  }

  renderBoxes = () => {
    const { recognitions, imageHeight, imageWidth } = this.state
    return recognitions.map((res, id) => {
      const width = res['rect']['w'] * imageWidth * Config.borderBox.compensation
      const height = res['rect']['h'] * imageHeight * Config.borderBox.compensation
      const left = res['rect']['x'] * imageWidth
      const top = res['rect']['y'] * imageHeight
      return (
        <View key={id}>
          <Text
            style={{
              color: Config.borderBox.fontColor,
              fontSize: Config.borderBox.fontSize,
              position: 'absolute',
              top,
              left
            }}
          >
            {res['detectedClass'] +
            ' ' +
            (res['confidenceInClass'] * 100).toFixed(0) +
            '%'}
          </Text>
          <View style={[styles.box, { top, left, width, height }]}/>
        </View>
      )
    })
  }

  takePicture = async() => {
    this.clearDetect()
    if (this.camera) {
      const options = {
        quality: 1
      }
      const data = await this.camera.takePictureAsync(options)
      tflite.detectObjectOnImage(
        {
          path: data.uri,
          model: 'YOLO',
          imageMean: 0.0,
          imageStd: 255.0,
          threshold: 0.3,
          numResultsPerClass: 1,
          blockSize: 32
        },
        (err, res) => {
          if (err) console.log(err)
          else {
            this.setState({ recognitions: res })
          }
        }
      )
    }
  }

  clearDetect = () => {
    const { recognitions } = this.state
    if (recognitions.length > 0) {
      this.setState({ recognitions: [] })
    }
  }

  renderCamera = () => {
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
          style={{ position: 'absolute', bottom: 30, left: 30 }}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => { this.takePicture() }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>DETECT IT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 30, right: 30 }}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => { this.clearDetect() }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>CLEAR</Text>
        </TouchableOpacity>
      </RNCamera>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  box: {
    position: 'absolute',
    borderColor: Config.borderBox.borderColor,
    borderWidth: Config.borderBox.borderWidth
  },
  boxes: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
})
