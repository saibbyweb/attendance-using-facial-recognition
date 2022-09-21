import * as faceapi from 'face-api.js';
const MODELS_DIR = "/models";

export async function loadRequiredFaceAPIModel() {
  return Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_DIR),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_DIR),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_DIR)
  ])
}