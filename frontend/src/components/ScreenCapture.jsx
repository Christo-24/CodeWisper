import { useRef,useState,useEffect } from "react";

function ScreenCapture(){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [capturing, setCapturing] = useState(null);
    const[previousimage,setPreviousImage]=useState(null);

    useEffect(() => {
        if(!stream) return;
        const interval = setInterval(() => {
            captureFrame();
        },3000);
        return () => clearInterval(interval);
    }, [stream]);
    
    const startCapture = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Screen sharing failed:", error);
        }
    };
    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        if(previousimage===imageData){
            console.log("Same frame captured, skipping...");
            return;
        }
        setPreviousImage(imageData);
        setCapturing(imageData);
    };
    return (
        <div>
            <h1>CodeWisper</h1>
            <button onClick={startCapture}>Start Screen Capture</button>
            <button onClick={captureFrame}>Capture Frame</button>
            <br />
            <br />
            <video ref={videoRef} autoPlay playsInline width="800"/>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {capturing && (
                <div>
                    <h2>Captured Frame</h2>
                    <img src={capturing} alt="Captured " width="500" />
                </div>
            )}
        </div>
    );
}
export default ScreenCapture;