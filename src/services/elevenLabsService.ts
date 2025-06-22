// ElevenLabs Text-to-Speech Service
const ELEVENLABS_API_KEY = 'sk_755fcbce9b35b0e4fb3ae98e474eb9df2f77d0c4f4e3e412';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different personalities
export const VOICE_IDS = {
  // Rachel - Calm, soothing voice for health coaching
  rachel: 'pNInz6obpgDQGcFmaJgB',
  // Adam - Professional, clear voice
  adam: 'pqHfZKP75CvOlQylNhV4',
  // Bella - Friendly, encouraging voice
  bella: 'EXAVITQu4vr4xnSDxMaL',
  // Antoni - Warm, supportive voice
  antoni: 'ErXwobaYiN019PkySvjV'
};

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = ELEVENLABS_API_KEY;
    this.baseUrl = ELEVENLABS_API_URL;
  }

  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(
    text: string,
    voiceId: string = VOICE_IDS.rachel,
    voiceSettings: VoiceSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  ): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error in textToSpeech:', error);
      throw error;
    }
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  /**
   * Play audio from ArrayBuffer
   */
  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        
        audio.play();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert text to speech and play immediately
   */
  async speakText(
    text: string,
    voiceId: string = VOICE_IDS.rachel,
    voiceSettings?: VoiceSettings
  ): Promise<void> {
    try {
      const audioBuffer = await this.textToSpeech(text, voiceId, voiceSettings);
      await this.playAudio(audioBuffer);
    } catch (error) {
      console.error('Error in speakText:', error);
      throw error;
    }
  }

  /**
   * Check if the service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'HEAD',
        headers: {
          'xi-api-key': this.apiKey
        }
      });
      return response.ok;
    } catch (error) {
      console.error('ElevenLabs service health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const elevenLabsService = new ElevenLabsService();