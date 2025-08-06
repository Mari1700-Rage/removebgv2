// lib/loadOnnxModel.ts
import * as ort from 'onnxruntime-web';

export async function loadOnnxModel(): Promise<ort.InferenceSession> {
  try {
    const response = await fetch('/api/model');
    if (!response.ok) throw new Error('Failed to fetch ONNX model');

    const arrayBuffer = await response.arrayBuffer();

    const session = await ort.InferenceSession.create(arrayBuffer, {
      executionProviders: ['wasm'],
    });

    return session;
  } catch (error) {
    console.error('Error loading ONNX model:', error);
    throw error;
  }
}
