import React, { Suspense, useState, useEffect } from 'react';

import DataHandler from './DataHandler';

import Video from './Video';

const CameraHandler = () => {

    const [ isCameraSupported, setCameraSupported ] = useState(false);
    const [ isCameraEnabled, setCameraEnabled ] = useState(DataHandler.isCameraPermissionGranted());
    const [deviceInfo, setDeviceInfo] = React.useState(null);
    const [cameraVisible, setCameraVisible] = React.useState(false);
    const [barcode, setBarcode] = useState(null);


    useEffect(() => {
        setDeviceInfo(JSON.stringify(navigator.mediaDevices))
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setCameraSupported(true);
            // setCameraVisible(true)
        }
    }, [])

    const onCamEnabled = () => {
        DataHandler.cameraPermissionGranted();
        setCameraEnabled(true);
    }

    const handleCameraVisibility = (visibility) => {
        setCameraVisible(visibility)
    };

    return (
        <>
            <p>Barcode scanned: {barcode}</p>
            {isCameraSupported && isCameraEnabled ?
                cameraVisible ? <Suspense fallback={<div>Loading...</div>}>
                    <Video setBarcode={setBarcode} handleCameraVisibility={handleCameraVisibility}/>
                    <div onClick={() => handleCameraVisibility(false)}>Turn off camera</div>
                </Suspense> : <div onClick={() => handleCameraVisibility(true)}>Camera hidden - press to open</div>
                : ''
            }
            {isCameraSupported && !isCameraEnabled ?
                <>
                    <div className="cameraHandler__message">Enable your camera with the button below
                        <br/>
                        <div className="cameraHandler__messageIcon">{deviceInfo}</div>
                    </div>
                    <button type="button" aria-label="Enable Camera" className="btn__round camera__enable" onClick={onCamEnabled}>
                        Camera hidden - press to open
                    </button>
                </>
                :
                ""
            }
            {!isCameraSupported ?
                <div className="cameraHandler__unsopported">
                    <div>
                        Device info: {deviceInfo}
                    </div>
                </div>
                :
                ""
            }
        </>
    );
}

export default CameraHandler;