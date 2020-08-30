import React, {useState, useEffect} from 'react';
import Quagga from 'quagga';
import VideoSkeleton from "./VideoLoader";

const Video = ({history}) => {
    const [videoInit, setVideoInit] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [barcode, setBarcode] = useState(null);

    const onProductFound = (code) => {
        Quagga.stop();
        console.log('code: ', code)
        if (code === 'not-found') {
            //history.push(`/product/${code}?code=${barcode}`);
        } else {
            //history.push(`/product/${code}`);
        }
    }

    const onInitSuccess = () => {
        Quagga.start();
        setVideoInit(true);
    }

    const onDetected = (result) => {
        console.log('result: ', result)
        setBarcode(result.codeResult.code);
        Quagga.offDetected(onDetected);
    }

    const onInfoFetched = (res) => {
        const {status, code} = res;
        setBarcode(code);
        setAttempts(prevState => prevState + 1);

        if (status === 1) {
            onProductFound(code);
        } else {
            Quagga.onDetected(onDetected);
        }
    }

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
                decoder: {
                    readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'code_128_reader']
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

    useEffect(() => {
        if (attempts > 3) {
            onProductFound('not-found');
        }
    }, [attempts]);

    return (
        <div>
            <div className="video__explanation">
                <p>Scan a product&apos;s barcode and get its nutritional values <span role="img"
                                                                                      aria-label="apple">🍎</span></p>
                <p>Barcode scanned: {barcode}</p>
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