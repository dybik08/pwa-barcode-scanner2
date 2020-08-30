import React, {useState, useEffect} from 'react';
import Quagga from '@ericblade/quagga2';
import VideoSkeleton from "./VideoLoader";
import './video.css';

const Video = (props) => {
    const [videoInit, setVideoInit] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const onInitSuccess = () => {
        Quagga.start();
        setVideoInit(true);
    };

    const onDetected = (result) => {
        console.log('result: ', result)
        props.setBarcode(result.codeResult.code);
        // Quagga.offDetected(onDetected);
        // Quagga.stop();
        props.handleCameraVisibility(false)
    };

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#video')
                },
                numOfWorkers: 1,
                locate: true,
                decoder : {
                    readers : ['ean_reader', 'upc_reader', 'code_128_reader']
                }
            }, (err) => {
                if (err) {
                    console.log('VIDEO ERROR: ', err)
                    setVideoError(true);
                    return;
                }
                onInitSuccess();
            });
            Quagga.onDetected(onDetected);
        }
    }, []);


    return (
        <div>
            <div className="video__explanation">
                <p>Scan a product&apos;s barcode and get its nutritional values <span role="img"
                                                                                      aria-label="apple">🍎</span></p>

            </div>
            <div className="video__container">
                {videoError ?
                    <div className="skeleton__unsopported">
                        <div>
                            <p>Your device does not support camera access or something went wrong <span role="img"
                                                                                                        aria-label="thinking-face">🤔</span>
                            </p>
                            <p>You can enter the barcode below</p>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="video" id="video"/>
                        {videoInit ? '' : <VideoSkeleton/>}
                    </div>
                }
            </div>
        </div>
    );
}

export default Video