import { useRef, useEffect, useCallback } from 'react';

// Neural Network CPPN Shader Background - Canvas 2D Implementation
export default function NeuralBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Sigmoid function
  const sigmoid = useCallback((x) => 1 / (1 + Math.exp(-x)), []);

  // Matrix multiplication helper
  const matVecMul = useCallback((mat, vec) => {
    return [
      mat[0][0] * vec[0] + mat[0][1] * vec[1] + mat[0][2] * vec[2] + mat[0][3] * vec[3],
      mat[1][0] * vec[0] + mat[1][1] * vec[1] + mat[1][2] * vec[2] + mat[1][3] * vec[3],
      mat[2][0] * vec[0] + mat[2][1] * vec[1] + mat[2][2] * vec[2] + mat[2][3] * vec[3],
      mat[3][0] * vec[0] + mat[3][1] * vec[1] + mat[3][2] * vec[2] + mat[3][3] * vec[3],
    ];
  }, []);

  // Simplified CPPN function for performance
  const cppn_fn = useCallback((x, y, time) => {
    const in0 = 0.1 * Math.sin(0.3 * time);
    const in1 = 0.1 * Math.sin(0.69 * time);
    const in2 = 0.1 * Math.sin(0.44 * time);

    // Simplified neural network layers
    const r = Math.sqrt(x * x + y * y);
    
    // Layer computations (simplified for performance)
    const l1_0 = sigmoid(6.54 * x + 2.46 * y - 5.48 * (0.39 + in0) + 6.04 * (0.36 + in1) + 0.85 * (0.14 + in2));
    const l1_1 = sigmoid(-3.61 * x + 3.17 * y - 6.16 * (0.39 + in0) - 5.54 * (0.36 + in1) - 5.72 * r);
    const l1_2 = sigmoid(0.76 * x + 1.22 * y + 1.87 * (0.39 + in0) - 0.91 * (0.36 + in1) + 3.98 * (0.14 + in2));
    const l1_3 = sigmoid(-1.14 * x + 0.06 * y - 4.77 * (0.39 + in0) + 3.25 * (0.36 + in1) + 1.65 * (0.14 + in2));
    
    const l2_0 = sigmoid(-3.35 * x + 0.86 * y + 2.49 * (0.39 + in0) + 3.31 * (0.36 + in1) + 5.24 * (0.14 + in2));
    const l2_1 = sigmoid(-6.06 * x + 1.74 * y - 3.50 * (0.39 + in0) + 8.21 * (0.36 + in1) - 13.03 * r);
    const l2_2 = sigmoid(0.56 * x + 5.64 * y + 1.72 * (0.39 + in0) + 1.14 * (0.36 + in1) + 0.01 * (0.14 + in2));
    const l2_3 = sigmoid(-4.47 * x + 1.61 * y + 6.36 * (0.39 + in0) - 1.17 * (0.36 + in1) + 15.87 * r);
    
    // More layers with mixing
    const l3_0 = sigmoid(5.21 * l1_0 - 5.60 * l1_1 - 10.58 * l1_2 + 4.30 * l1_3 - 17.65 * l2_0 + 6.27 * l2_1);
    const l3_1 = sigmoid(-7.18 * l1_0 - 25.36 * l1_1 + 24.29 * l1_2 - 1.96 * l1_3 - 10.51 * l2_0 - 502.75 * l2_1);
    const l3_2 = sigmoid(2.72 * l1_0 + 4.07 * l1_1 + 21.10 * l1_2 + 2.35 * l1_3 + 2.26 * l2_0 - 12.64 * l2_1);
    
    // Output layer
    const r_out = sigmoid(1.68 * l3_0 - 1.88 * l3_1 - 1.33 * l3_2 + 0.27 * l1_0 - 0.63 * l1_1 - 2.97 * l1_2 + 1.42 * l1_3);
    const g_out = sigmoid(1.38 * l3_0 - 1.48 * l3_1 - 1.09 * l3_2 + 0.23 * l1_0 - 0.59 * l1_1 - 2.58 * l1_2 + 1.19 * l1_3);
    const b_out = sigmoid(2.96 * l3_0 - 3.59 * l3_1 - 2.31 * l3_2 + 0.44 * l1_0 - 0.91 * l1_1 - 4.90 * l1_2 + 2.52 * l1_3);

    return [r_out, g_out, b_out];
  }, [sigmoid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = 0.15; // Lower resolution for performance

    const resize = () => {
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          // Convert to normalized coordinates (-1 to 1)
          const x = (px / width) * 2 - 1;
          const y = -((py / height) * 2 - 1);

          const [r, g, b] = cppn_fn(x, y, time);

          const idx = (py * width + px) * 4;
          data[idx] = Math.floor(r * 255);
          data[idx + 1] = Math.floor(g * 255);
          data[idx + 2] = Math.floor(b * 255);
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cppn_fn]);

  return (
    <div className="absolute inset-0 -z-10 w-full h-full" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          imageRendering: 'auto',
          filter: 'blur(2px)'
        }}
      />
      {/* Overlay gradient for better text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
    </div>
  );
}
