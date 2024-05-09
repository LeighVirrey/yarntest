import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs"
import * as facemesh from "@tensorflow-models/facemesh"
import Webcam from "react-webcam"
import './App.css';
import { drawMesh } from './components/utilities'
import React, { useRef } from 'react';

function App() {
  //useref for webacam and canvas
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runFacemesh = async () => {
    //loading facemesh
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    })
    //this set interval detects every 100ms and after detecting it runs the detect function
    setInterval(() => {
      detect(net)
    }, 100)
  }

  //detect function, detects face and starts running
  const detect = async (net) => {
    //check if webcam is available
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      //get video properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      //set video properties
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      //set canvas properties
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      //make detections
      const face = await net.estimateFaces(video)
      console.log(face)

      //get canvas context
      const ctx = canvasRef.current.getContext("2d")
      drawMesh(face, ctx)
    }
  }

  runFacemesh()
  return (
    <div className="App">
      <Webcam ref={webcamRef} style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zindex: 9,
        width: 640,
        height: 480
      }} />
      <canvas ref={canvasRef} style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zindex: 9,
        width: 640,
        height: 480
      }} />
    </div>
  );
}

export default App;
