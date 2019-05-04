# react-native | tensorflow-lite | yolov2
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://github.com/MIFind/RN-whatsit)

### LICENSE 
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/MIFind/RN-whatsit/master/LICENSE)

### 安装与运行
  ```
  1. git clone https://github.com/MIFind/RN-whatsit.git --depth 1
  2. npm install
  3. react-native link
  4. 配置
      - ios -
      cd ios && pod install
      - android -
      进入android studio修改tflite-react-native的build.gradle的compile改为implemention（该步骤建议fork改一下该库的引用。）
  
  5. xcode或as直接跑
  6. 若修改model及label，则去android/app/src/main/assets/ 和 ios/models里修改
  ```
