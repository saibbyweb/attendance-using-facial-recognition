import * as faceapi from 'face-api.js';
const MODELS_DIR = "/models";

export async function loadRequiredFaceAPIModels() {
  return Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_DIR),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_DIR),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_DIR)
  ])
}

export async function detectFaces(image: File) {
  const imageElement = await faceapi.bufferToImage(image);
  const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks().withFaceDescriptors()
  return detections;
}

/* load labelled images */
function loadLabeledImages() {
  const labels = ['20117300022','2011036728'];
  
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      const img = await faceapi.fetchImage(`/labels/${label}/1.jpg`)
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      descriptions.push(detections!.descriptor)
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

export async function generateFaceMatcher() {
  const labelledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labelledFaceDescriptors, 0.6)
  return faceMatcher;
}

