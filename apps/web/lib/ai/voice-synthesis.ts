import { createClient } from '@/lib/supabase/client';

// ElevenLabs API configuration
const ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

// Available voices for meditation (Spanish-optimized)
export const MEDITATION_VOICES = {
  maria: {
    id: 'EXAVITQu4vr4xnSDxMaL', // Example voice ID - replace with actual
    name: 'María',
    description: 'Voz femenina cálida y reconfortante',
    gender: 'female',
    language: 'es'
  },
  carlos: {
    id: 'ErXwobaYiN019PkySvjV', // Example voice ID - replace with actual
    name: 'Carlos',
    description: 'Voz masculina serena y profunda',
    gender: 'male',
    language: 'es'
  },
  sofia: {
    id: 'MF3mGyEYCl7XYWbV9V6O', // Example voice ID - replace with actual
    name: 'Sofía',
    description: 'Voz femenina suave y maternal',
    gender: 'female',
    language: 'es'
  }
};

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface AudioGenerationResult {
  audioUrl: string;
  duration: number;
  voiceId: string;
}

// Default voice settings optimized for meditation
const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.75, // Higher stability for calmer speech
  similarity_boost: 0.75,
  style: 0.5, // Neutral style
  use_speaker_boost: true
};

export async function generateAudio(
  text: string,
  voiceId: string = MEDITATION_VOICES.maria.id,
  settings: VoiceSettings = DEFAULT_VOICE_SETTINGS
): Promise<AudioGenerationResult> {
  try {
    // Generate audio using ElevenLabs API
    const response = await fetch(`${ELEVEN_LABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY || ''
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2', // Best for Spanish
        voice_settings: settings
      })
    });

    if (!response.ok) {
      throw new Error(`Voice synthesis failed: ${response.statusText}`);
    }

    // Get audio data
    const audioBlob = await response.blob();
    
    // Upload to Supabase Storage
    const supabase = createClient();
    const fileName = `meditation_${Date.now()}_${voiceId}.mp3`;
    const filePath = `meditations/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(filePath, audioBlob, {
        contentType: 'audio/mpeg',
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('audio')
      .getPublicUrl(filePath);

    // Estimate duration (rough calculation based on text length and speech rate)
    const wordsPerMinute = 120; // Slow pace for meditation
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = Math.ceil((wordCount / wordsPerMinute) * 60);

    return {
      audioUrl: publicUrl,
      duration: estimatedDuration,
      voiceId
    };
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}

// Generate audio with background music mixing (client-side)
export async function generateMeditationAudio(
  scriptureText: string,
  meditationGuide: string,
  voiceId: string,
  includeMusic: boolean = true
): Promise<AudioGenerationResult> {
  // Combine scripture and meditation guide with appropriate pauses
  const fullText = `${scriptureText}

... ... ...

${meditationGuide}`;

  // Generate the voice audio
  const result = await generateAudio(fullText, voiceId);

  // Note: Background music mixing would typically be done client-side
  // using Web Audio API when playing the meditation

  return result;
}

// Helper to check voice availability
export async function checkVoiceAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${ELEVEN_LABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY || ''
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error checking voice availability:', error);
    return false;
  }
}

// Get user's remaining character count
export async function getCharacterLimit(): Promise<{ used: number; limit: number } | null> {
  try {
    const response = await fetch(`${ELEVEN_LABS_API_URL}/user`, {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY || ''
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      used: data.subscription.character_count,
      limit: data.subscription.character_limit
    };
  } catch (error) {
    console.error('Error getting character limit:', error);
    return null;
  }
}