import * as faceapi from 'face-api.js';
const MODELS_DIR = "/models";

export async function loadRequiredFaceAPIModel() {
  return Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_DIR),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_DIR),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_DIR)
  ])
}

export async function processImage(image: File) {
  const imageElement = await faceapi.bufferToImage(image);
  const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks().withFaceDescriptors()
  return detections.length;
}