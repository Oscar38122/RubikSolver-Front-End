import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Camera } from 'expo-camera';
import endpoints from './src/API/endpoints';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  let facesTaken = 0;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onResetPressed = async () => {
    facesTaken = 0;
    try {
      let response = await endpoints.reset();
      console.log('Response from API:', response.data);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  }

  const onSolvePressed = async () => {
    if (facesTaken != 6){
      console.warn(`You need to take a photo for each face of the cube. Current count = ${facesTaken}`)
    }
    else {
      try {
        let response = await endpoints.solve();
        console.log('Response from API:', response.data);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  }

  const onTakePicturePressed = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      facesTaken++;
      console.log('Photo taken:', photo.uri, facesTaken);

      let formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'RubikFaceTest.jpg',
      });
      formData.append('number', facesTaken.toString());

      // Send the photo to API
      try {
        let response = await endpoints.face(formData);
        console.log('Response from API:', response.data);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef} 
          style={styles.camera}
          type={Camera.Constants.Type.back}
          zoom={0.007}
        >
          <View>
            <View style={styles.square} />
          </View>
          <Pressable onPress={onTakePicturePressed} style={styles.cameraButton}>
            <View style={styles.innerCircle} />
          </Pressable>
        </Camera>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable onPress={onResetPressed} style={styles.buttonContainer}>
          <Text style={styles.text}>Reset</Text>
        </Pressable>
        <Pressable onPress={onSolvePressed} style={styles.buttonContainer}>
          <Text style={styles.text}>Solve</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-evenly",
    gap: 20,
  },
  buttonContainer: {
    backgroundColor: "#315A72",
    paddingVertical: 20,
    marginVertical: 30,

    alignItems: "center",
    borderRadius: 50,
    borderColor: "#D2D2D2",
    width: '40%'
  },
  buttonContent: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  cameraContainer: {
    flex: 1, 
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1, 
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 350,
    height: 350,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  cameraButton: {
    position: 'absolute', 
    bottom: 50, 
    alignSelf: 'center', 
    width: 85, 
    height: 85, 
    borderRadius: 55, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  innerCircle: {
    width: 75, 
    height: 75, 
    borderRadius: 55, 
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#000',
  },
});
