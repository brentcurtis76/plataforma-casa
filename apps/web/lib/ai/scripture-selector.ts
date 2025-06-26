import OpenAI from 'openai';

// Lazy initialize OpenAI client
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface ScriptureResult {
  reference: string;
  text: string;
  version: string;
  meditationGuide: string;
}

// Emotion categories with Spanish translations
export const EMOTIONS = {
  // Positive emotions
  joy: { es: 'Alegría', en: 'Joy' },
  peace: { es: 'Paz', en: 'Peace' },
  gratitude: { es: 'Gratitud', en: 'Gratitude' },
  hope: { es: 'Esperanza', en: 'Hope' },
  love: { es: 'Amor', en: 'Love' },
  
  // Challenging emotions
  anxiety: { es: 'Ansiedad', en: 'Anxiety' },
  fear: { es: 'Miedo', en: 'Fear' },
  sadness: { es: 'Tristeza', en: 'Sadness' },
  anger: { es: 'Enojo', en: 'Anger' },
  loneliness: { es: 'Soledad', en: 'Loneliness' },
  
  // Spiritual states
  doubt: { es: 'Duda', en: 'Doubt' },
  confusion: { es: 'Confusión', en: 'Confusion' },
  guilt: { es: 'Culpa', en: 'Guilt' },
  weakness: { es: 'Debilidad', en: 'Weakness' },
  seeking: { es: 'Búsqueda', en: 'Seeking' },
};

export async function findScripture(
  emotion: string, 
  context?: string,
  language: 'es' | 'en' = 'es'
): Promise<ScriptureResult> {
  try {
    const systemPrompt = language === 'es' 
      ? `Eres un consejero bíblico compasivo que ayuda a las personas a encontrar consuelo y guía en las Escrituras. 
         Debes responder en español usando la versión Reina-Valera 1960 de la Biblia.
         Tu tarea es seleccionar un versículo bíblico apropiado para la emoción que la persona está sintiendo y 
         proporcionar una breve guía de meditación.`
      : `You are a compassionate biblical counselor who helps people find comfort and guidance in Scripture. 
         Your task is to select an appropriate Bible verse for the emotion the person is feeling and 
         provide a brief meditation guide.`;

    const userPrompt = language === 'es'
      ? `La persona está sintiendo: ${emotion}${context ? `. Contexto adicional: ${context}` : ''}
         
         Por favor proporciona:
         1. Una referencia bíblica apropiada
         2. El texto completo del versículo (Reina-Valera 1960)
         3. Una guía de meditación de 3-5 minutos que:
            - Conecte el versículo con la emoción
            - Ofrezca reflexiones consoladoras
            - Incluya una oración guiada
            - Termine con una afirmación de fe
         
         Formato de respuesta JSON:
         {
           "reference": "libro capítulo:versículo",
           "text": "texto completo del versículo",
           "version": "RVR1960",
           "meditationGuide": "guía de meditación completa"
         }`
      : `The person is feeling: ${emotion}${context ? `. Additional context: ${context}` : ''}
         
         Please provide:
         1. An appropriate Bible reference
         2. The full verse text (NIV)
         3. A 3-5 minute meditation guide that:
            - Connects the verse to the emotion
            - Offers comforting reflections
            - Includes a guided prayer
            - Ends with an affirmation of faith
         
         JSON response format:
         {
           "reference": "book chapter:verse",
           "text": "full verse text",
           "version": "NIV",
           "meditationGuide": "complete meditation guide"
         }`;

    const client = getOpenAI();
    if (!client) {
      throw new Error('OpenAI client not initialized');
    }
    
    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    
    return {
      reference: response.reference || '',
      text: response.text || '',
      version: response.version || (language === 'es' ? 'RVR1960' : 'NIV'),
      meditationGuide: response.meditationGuide || ''
    };
  } catch (error) {
    console.error('Error finding scripture:', error);
    
    // Fallback responses for common emotions
    const fallbacks: Record<string, ScriptureResult> = {
      anxiety: {
        reference: language === 'es' ? 'Filipenses 4:6-7' : 'Philippians 4:6-7',
        text: language === 'es' 
          ? 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.'
          : 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
        version: language === 'es' ? 'RVR1960' : 'NIV',
        meditationGuide: language === 'es'
          ? 'Respira profundamente y permite que estas palabras penetren en tu corazón. Dios te invita a entregarle todas tus preocupaciones...'
          : 'Take a deep breath and let these words sink into your heart. God invites you to give Him all your worries...'
      },
      fear: {
        reference: language === 'es' ? 'Isaías 41:10' : 'Isaiah 41:10',
        text: language === 'es'
          ? 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.'
          : 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
        version: language === 'es' ? 'RVR1960' : 'NIV',
        meditationGuide: language === 'es'
          ? 'En este momento de temor, recuerda que no estás solo. Dios está contigo ahora mismo...'
          : 'In this moment of fear, remember that you are not alone. God is with you right now...'
      }
    };

    return fallbacks[emotion] || fallbacks.anxiety;
  }
}

// Helper function to get a random scripture for daily meditation
export async function getDailyScripture(language: 'es' | 'en' = 'es'): Promise<ScriptureResult> {
  const dailyEmotions = ['peace', 'gratitude', 'hope', 'love', 'joy'];
  const randomEmotion = dailyEmotions[Math.floor(Math.random() * dailyEmotions.length)];
  
  return findScripture(randomEmotion, 'daily meditation', language);
}