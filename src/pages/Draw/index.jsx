import { useRef, useEffect, useState } from 'react';
import { Heading, Button } from '@chakra-ui/react';
import base64 from "base-64";
import axios from "@/modules/axios.js";
import { useCookies } from 'react-cookie';

import "./style.scss";

const Draw = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const createPixelMatrix = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scaleFactor = 10;
    const width = canvas.width / scaleFactor;
    const height = canvas.height / scaleFactor;
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let matrix = Array.from({ length: height }, () => new Array(width).fill(0));

    for (let y = 0; y < canvas.height; y += scaleFactor) {
      for (let x = 0; x < canvas.width; x += scaleFactor) {
        let black = false;
        // Check every pixel within the current grid cell for being black
        for (let dy = 0; dy < scaleFactor && !black; dy++) {
          for (let dx = 0; dx < scaleFactor && !black; dx++) {
            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
            // Check if the pixel is not fully transparent and is black
            if (pixelData[idx + 3] > 0 && pixelData[idx] === 0 && pixelData[idx + 1] === 0 && pixelData[idx + 2] === 0) {
              black = true;
            }
          }
        }

        if (black) {
          matrix[Math.floor(y / scaleFactor)][Math.floor(x / scaleFactor)] = 1;
        }
      }
    }

    return matrix;
  }

  const submit = async () => {
    const matrix = createPixelMatrix();
    const jsonString = JSON.stringify(matrix);
    const encoded = base64.encode(jsonString);

    const response = await axios("predict", {
      method: "POST",
      data: {
        encoded,
        token: cookies.token
      },
    });

    setPrediction(response.data.predictionNumber);
  }

  const keyDown = (event) => {
    if (event.ctrlKey && event.code === "KeyZ") {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      setPrediction(null);
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keyDown);

    return () => {
      window.removeEventListener('keydown', keyDown);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
  }, []);

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const getGridPosition = (x, y, scaleFactor) => {
    return {
      x: Math.floor(x / scaleFactor) * scaleFactor,
      y: Math.floor(y / scaleFactor) * scaleFactor,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const mousePos = getMousePos(canvas, e);

    const scaleFactor = 10; // Since the canvas is 280x280 and we want a 28x28 grid
    const gridPos = getGridPosition(mousePos.x, mousePos.y, scaleFactor);
    setPrediction(null);

    context.fillRect(gridPos.x, gridPos.y, scaleFactor, scaleFactor);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="draw-container">
      <Heading>Welcome!</Heading>
      <p>Use this canvas to draw a digit and then submit your result!</p>
      <p>Use Ctrl + Z to reset the canvas!</p>
      <div className="canvas-container">
        <canvas
          width="280"
          height="280"
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
      {canvasRef.current && <Button onClick={submit} colorScheme='green'>Submit!</Button>}
      {prediction != null && <p>Hmm.. I think it is number {prediction}! Am I right? 😅</p>}
    </div>
  );
};

export default Draw;
