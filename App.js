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

  const onSubmitPressed = async () => {
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
        </Camera>
      </View>
      <Pressable onPress={onSubmitPressed} style={styles.buttonContainer}>
        <Text style={styles.text}>Submit</Text>
      </Pressable>
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
  buttonContainer: {
    backgroundColor: "#315A72",
    paddingVertical: 20,
    marginVertical: 30,

    alignItems: "center",
    borderRadius: 50,
    borderColor: "#D2D2D2",
    width: '80%'
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
});
