import * as faceapi from 'face-api.js';
import React from 'react';



function Camera() {

  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const videoRef = React.useRef();
  const videoHeight = 650;
  const videoWidth = 1000;
  const canvasRef = React.useRef();

  const minConfidence = 0.7




  React.useEffect(() => {
    const loadModels = async () => {
      console.log('model loaded');

      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    }
    loadModels();

  }, []);

  const startVideo = () => {

    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(async (stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();

      })
      .catch(err => {
        console.error("error:", err);
      });
  }


  const videoCapture = () => {
    const video = document.getElementById('deviceDetection')

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);

    const img = document.createElement("img");
    img.src = canvas.toDataURL('image/jpg');
  }

  const existingUserList = async () => {
    const labels = ['Baljeet Masih','Pooran Das','Sunil','Sunny Kumar','Surinder Kumar'] // for WebCam

    return Promise.all(
      labels.map(async (label) => {
        const descriptions = []

        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(`../../users_images/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()
          // console.log(label + i + JSON.stringify(detections))
          descriptions.push(detections.descriptor)
        }
        // document.body.append(label+' Faces Loaded | ')
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }


  const handleVideoOnPlay = async () => {
    const labeledDescriptors = await existingUserList()
    console.log(labeledDescriptors)

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, minConfidence)



    setInterval(async () => {
      if (canvasRef && canvasRef.current) {

        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);

        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()


        canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const results = resizedDetections.map((d) => {
          return faceMatcher.findBestMatch(d.descriptor)
        })

        results.forEach( (result, i) => {
            const box = resizedDetections[i].detection.box
            console.log(box)
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvasRef.current)
        })

      }
    }, 100)
  }

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {
          captureVideo && modelsLoaded ?
            <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Camera On
            </button>
            :
            <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Camera Off
            </button>
        }
      </div>
      {
        captureVideo ?
          modelsLoaded ?
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>

                <video id="deviceDetection" ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas id="CandeviceDetection" ref={canvasRef} style={{ position: 'absolute' }} />



              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>


          </>
      }

    </div>
  );
}

export default Camera;
