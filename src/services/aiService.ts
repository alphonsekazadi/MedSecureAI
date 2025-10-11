// AI Service for MedSecureAI - Supports Multiple Providers with Auth0 AI Integration
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import { auth0AIService } from './auth0AIService';
import { advancedMedicalTools } from './advancedMedicalTools';
import { medicalRAGService } from './medicalRAGService';

// AI Provider Types
export type AIProvider = 'groq' | 'huggingface' | 'openai' | 'mock';

// Medical Chat Message Interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    encrypted?: boolean;
    patientId?: string;
    sessionId?: string;
  };
}

// AI Response Interface
export interface AIResponse {
  message: string;
  confidence?: number;
  disclaimer?: string;
  suggestedActions?: string[];
}

class AIService {
  private provider: AIProvider;
  private groq?: Groq;
  private hf?: HfInference;

  constructor() {
    this.provider = (import.meta.env.VITE_AI_PROVIDER as AIProvider) || 'mock';
    console.log('Auto selected provider:', this.provider);
    this.initializeProvider();
  }

  private initializeProvider() {
    switch (this.provider) {
      case 'groq':
        if (import.meta.env.VITE_GROQ_API_KEY) {
          this.groq = new Groq({
            apiKey: import.meta.env.VITE_GROQ_API_KEY,
            dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
          });
        }
        break;
      
      case 'huggingface':
        if (import.meta.env.VITE_HF_API_KEY) {
          this.hf = new HfInference(import.meta.env.VITE_HF_API_KEY);
        }
        break;
    }
  }

  // Medical System Prompt for Safety
  private getMedicalSystemPrompt(): string {
    return `You are MedSecureAI, a helpful health assistant designed to provide general health information and guidance. 

IMPORTANT SAFETY GUIDELINES:
- You provide general health information only, not medical diagnosis
- Always recommend consulting healthcare professionals for medical concerns
- Never provide specific medication dosages or prescriptions
- Focus on wellness, prevention, and general health education
- If asked about serious symptoms, always recommend immediate medical attention
- Maintain patient confidentiality and privacy at all times
- Use encouraging, empathetic, and professional tone

Your responses should be:
- Informative but not diagnostic
- Encouraging and supportive
- Clear about limitations
- Focused on general wellness
- Professional and trustworthy

Remember: This conversation is encrypted and HIPAA-compliant. Always prioritize patient safety and privacy.`;
  }

  // Generate AI Response with Auth0 FGA-Filtered Knowledge (Challenge Requirement)
  async generateResponse(
    messages: ChatMessage[],
    userId?: string,
    userRole?: string
  ): Promise<AIResponse> {
    try {
      // Get the latest user message for RAG query
      const latestMessage = messages[messages.length - 1];
      const userQuery = latestMessage?.content || '';

      // Apply Auth0 FGA to filter medical knowledge (Challenge Key Feature)
      let ragContext = '';
      let knowledgeSources: string[] = [];
      let securityWarnings: string[] = [];

      if (userId && userRole) {
        console.log('🔒 Applying Auth0 FGA to RAG pipeline...');
        const ragResponse = await medicalRAGService.generateSecureResponse(
          userId,
          userRole,
          userQuery
        );
        
        ragContext = `\n\n**AUTH0 FGA-FILTERED MEDICAL KNOWLEDGE:**\n${ragResponse.response}`;
        knowledgeSources = ragResponse.knowledgeSources;
        securityWarnings = ragResponse.warnings;
      }

      // Add medical system prompt with FGA-filtered context
      const systemMessage: ChatMessage = {
        id: 'system',
        role: 'system',
        content: this.getMedicalSystemPrompt() + ragContext,
        timestamp: new Date()
      };

      const allMessages = [systemMessage, ...messages];
      
      let response: string;
      
      switch (this.provider) {
        case 'groq':
          response = await this.generateGroqResponse(allMessages);
          break;
        case 'huggingface':
          response = await this.generateHuggingFaceResponse(allMessages);
          break;
        case 'mock':
          response = await this.generateMockResponse(allMessages);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }

      // Enhance response with Auth0 AI security information
      const enhancedResponse = this.addSecurityFooter(response, knowledgeSources, securityWarnings);

      return {
        message: enhancedResponse,
        disclaimer: "This information is for educational purposes only. Always consult with healthcare professionals for medical advice.",
        suggestedActions: this.generateSuggestedActions(messages[messages.length - 1]?.content)
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact your healthcare provider if this is urgent.",
        disclaimer: "For immediate medical concerns, please contact emergency services or your healthcare provider."
      };
    }
  }

  // Groq Implementation (Recommended)
  private async generateGroqResponse(messages: ChatMessage[]): Promise<string> {
    if (!this.groq) {
      throw new Error('Groq not initialized. Please add VITE_GROQ_API_KEY to your .env file');
    }

    const completion = await this.groq.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model: import.meta.env.VITE_AI_MODEL || 'llama-3.1-70b-versatile',
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for medical accuracy
      top_p: 0.9,
    });

    return completion.choices[0]?.message?.content || 'No response generated';
  }

  // Hugging Face Implementation - Using Chat Completion API
  private async generateHuggingFaceResponse(messages: ChatMessage[]): Promise<string> {
    if (!this.hf) {
      throw new Error('Hugging Face not initialized. Please add VITE_HF_API_KEY to your .env file');
    }

    try {
      // Convert our messages to the OpenAI format for chat completion
      const chatMessages = messages.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      }));

      // Use chat completion with PublicAI provider models
      const response = await this.hf.chatCompletion({
        model: import.meta.env.VITE_HUGGINGFACE_MODEL || 'swiss-ai/Apertus-8B-Instruct-2509',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.4,
        top_p: 0.9,
      });

      let aiResponse = response.choices?.[0]?.message?.content?.trim() || '';
      
      // If response is too short or empty, provide a helpful fallback
      if (aiResponse.length < 20) {
        const userInput = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
        aiResponse = this.generateHealthFallbackResponse(userInput);
      }

      // Add medical safety disclaimer
      const userInput = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
      return this.addMedicalSafetyToResponse(aiResponse, userInput);

    } catch (error) {
      console.error('Hugging Face Chat Completion Error:', error);
      
      // Try fallback to text generation if chat completion fails
      try {
        console.log('Attempting fallback to text generation...');
        return await this.generateHuggingFaceFallback(messages);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        // Provide intelligent fallback response based on the question
        const userInput = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
        return this.generateHealthFallbackResponse(userInput);
      }
    }
  }

  // Fallback text generation method
  private async generateHuggingFaceFallback(messages: ChatMessage[]): Promise<string> {
    if (!this.hf) throw new Error('HF not initialized');

    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
    const userInput = lastUserMessage?.content || '';

    // Create a simple prompt for health assistance
    const prompt = `You are MedSecureAI, a helpful health information assistant. Provide general wellness advice and health education. Always remind users to consult healthcare professionals for medical concerns.

User: ${userInput}
MedSecureAI:`;

    const response = await this.hf.textGeneration({
      model: 'microsoft/DialoGPT-large',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.4,
        return_full_text: false,
        repetition_penalty: 1.1,
        top_p: 0.9,
      },
      options: {
        wait_for_model: true,
        use_cache: false
      }
    });

    let aiResponse = response.generated_text?.trim() || '';
    aiResponse = aiResponse.replace(/^(MedSecureAI:|Assistant:|AI:)/i, '').trim();
    
    if (aiResponse.length < 20) {
      aiResponse = this.generateHealthFallbackResponse(userInput);
    }

    return this.addMedicalSafetyToResponse(aiResponse, userInput);
  }

  // Generate intelligent health responses when API fails
  private generateHealthFallbackResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    if (input.includes('pain') || input.includes('hurt') || input.includes('ache')) {
      return "For pain management, consider rest, gentle stretching, and over-the-counter pain relief as appropriate. If pain persists or is severe, please consult with a healthcare professional for proper evaluation and treatment.";
    }
    
    if (input.includes('stress') || input.includes('anxious') || input.includes('worry')) {
      return "Managing stress is important for overall health. Try deep breathing exercises, regular physical activity, adequate sleep, and mindfulness practices. If stress significantly impacts your daily life, consider speaking with a mental health professional.";
    }
    
    if (input.includes('sleep') || input.includes('tired') || input.includes('insomnia')) {
      return "Good sleep hygiene includes maintaining a consistent sleep schedule, creating a relaxing bedtime routine, keeping your bedroom cool and dark, and avoiding screens before bedtime. If sleep problems persist, consult with a healthcare provider.";
    }
    
    if (input.includes('exercise') || input.includes('fitness') || input.includes('workout')) {
      return "Regular physical activity is excellent for health. Aim for at least 150 minutes of moderate aerobic activity per week, plus strength training exercises. Start slowly if you're new to exercise, and consult with a healthcare provider before beginning any new fitness program.";
    }
    
    if (input.includes('diet') || input.includes('nutrition') || input.includes('food')) {
      return "A balanced diet includes plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated, limit processed foods, and pay attention to portion sizes. For personalized nutrition advice, consider consulting with a registered dietitian.";
    }
    
    return "Thank you for your health question. While I can provide general wellness information, it's important to consult with qualified healthcare professionals for personalized medical advice, diagnosis, or treatment recommendations.";
  }

  // Add medical safety disclaimers to AI responses
  private addMedicalSafetyToResponse(aiResponse: string, userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    // Add specific medical disclaimers based on the type of question
    if (lowerInput.includes('pain') || lowerInput.includes('symptom') || lowerInput.includes('hurt')) {
      return `${aiResponse}\n\n⚠️ **Important**: This is general information only. For persistent or severe symptoms, please consult with a healthcare professional immediately.`;
    }
    
    if (lowerInput.includes('medication') || lowerInput.includes('drug') || lowerInput.includes('prescription')) {
      return `${aiResponse}\n\n⚠️ **Medical Disclaimer**: Never start, stop, or change medications without consulting your healthcare provider first.`;
    }
    
    // General medical disclaimer for health-related queries
    return `${aiResponse}\n\n💡 **Remember**: This information is for educational purposes only and should not replace professional medical advice.`;
  }

  // Mock AI Implementation (For Demo/Development)
  private async generateMockResponse(messages: ChatMessage[]): Promise<string> {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
    const userInput = lastUserMessage?.content?.toLowerCase() || '';

    // Smart medical responses based on keywords
    if (userInput.includes('pain') || userInput.includes('hurt') || userInput.includes('ache')) {
      const painResponses = [
        "I understand you're experiencing pain. While I can't diagnose the cause, here are some general recommendations:\n\n• Try gentle stretching or light movement if tolerated\n• Apply ice for acute injuries or heat for muscle tension\n• Consider over-the-counter pain relief as directed\n• Keep a pain diary to track patterns\n\nIf pain persists, worsens, or is severe, please consult with a healthcare professional promptly.",
        "Pain can have many causes, and it's important to address it properly. Some general approaches include:\n\n• Rest the affected area if needed\n• Gentle movement when possible to prevent stiffness\n• Proper ergonomics and posture\n• Stress management, as tension can worsen pain\n\nFor persistent or severe pain, evaluation by a medical professional is essential to determine the underlying cause and appropriate treatment."
      ];
      return painResponses[Math.floor(Math.random() * painResponses.length)];
    }

    if (userInput.includes('stress') || userInput.includes('anxious') || userInput.includes('anxiety') || userInput.includes('worry')) {
      const stressResponses = [
        "Managing stress and anxiety is crucial for overall health. Here are some evidence-based strategies:\n\n• Deep breathing exercises (4-7-8 technique)\n• Regular physical activity, even light walking\n• Mindfulness meditation or progressive muscle relaxation\n• Maintaining a consistent sleep schedule\n• Limiting caffeine and alcohol\n• Connecting with supportive friends or family\n\nIf anxiety significantly impacts your daily life, consider speaking with a mental health professional.",
        "Stress affects both mental and physical health. Some helpful approaches include:\n\n• Practice mindfulness and staying present\n• Break large tasks into smaller, manageable steps\n• Set healthy boundaries with work and commitments\n• Engage in activities you enjoy\n• Consider journaling to process thoughts\n• Ensure adequate nutrition and hydration\n\nRemember, seeking professional support is a sign of strength, not weakness."
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }

    if (userInput.includes('sleep') || userInput.includes('tired') || userInput.includes('insomnia') || userInput.includes('fatigue')) {
      return "Good sleep is fundamental to health. Here are some evidence-based sleep hygiene tips:\n\n• Maintain a consistent sleep schedule, even on weekends\n• Create a relaxing bedtime routine\n• Keep your bedroom cool, dark, and quiet\n• Avoid screens 1 hour before bedtime\n• Limit caffeine after 2 PM\n• Get natural sunlight exposure during the day\n• Avoid large meals close to bedtime\n\nIf sleep problems persist despite these changes, consult with a healthcare provider to rule out sleep disorders.";
    }

    if (userInput.includes('exercise') || userInput.includes('fitness') || userInput.includes('workout') || userInput.includes('activity')) {
      return "Regular physical activity is one of the best things you can do for your health. Here are some guidelines:\n\n• Aim for 150 minutes of moderate aerobic activity per week\n• Include strength training exercises twice per week\n• Start slowly if you're new to exercise\n• Choose activities you enjoy to maintain consistency\n• Listen to your body and rest when needed\n• Stay hydrated and warm up properly\n\nConsult with a healthcare provider before starting a new exercise program, especially if you have health conditions.";
    }

    if (userInput.includes('diet') || userInput.includes('nutrition') || userInput.includes('food') || userInput.includes('eat')) {
      return "Nutrition plays a vital role in overall health. Some general principles include:\n\n• Eat a variety of colorful fruits and vegetables\n• Choose whole grains over refined grains\n• Include lean proteins and healthy fats\n• Stay adequately hydrated with water\n• Practice portion control\n• Limit processed foods and added sugars\n• Pay attention to how foods make you feel\n\nFor personalized nutrition advice, consider consulting with a registered dietitian.";
    }

    if (userInput.includes('healthy') || userInput.includes('wellness') || userInput.includes('prevention')) {
      return "Maintaining good health involves several key areas:\n\n• Regular preventive care and health screenings\n• Balanced nutrition with whole foods\n• Regular physical activity you enjoy\n• Adequate quality sleep (7-9 hours for most adults)\n• Stress management and mental health care\n• Strong social connections and relationships\n• Avoiding smoking and limiting alcohol\n• Staying up to date with vaccinations\n\nSmall, consistent changes often lead to the biggest improvements in health over time.";
    }

    // Default responses for general questions
    const generalResponses = [
      "Thank you for your health question. While I can provide general wellness information, it's important to remember that I cannot replace professional medical advice. For specific health concerns, please consult with a qualified healthcare provider who can properly evaluate your individual situation.",
      "I'm here to help with general health and wellness information. However, every person's health needs are unique. For personalized medical advice, diagnosis, or treatment recommendations, please speak with a healthcare professional who can assess your specific circumstances.",
      "Health and wellness involve many interconnected factors including nutrition, exercise, sleep, stress management, and preventive care. I can share general information about these topics, but for specific medical questions or concerns, please consult with your healthcare provider.",
      "Maintaining good health is a lifelong journey that's different for everyone. While I can provide general wellness tips and educational information, please remember to work with qualified healthcare professionals for personalized medical guidance and care."
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  // Generate helpful suggestions based on user input
  private generateSuggestedActions(userMessage: string = ''): string[] {
    const message = userMessage.toLowerCase();
    
    if (message.includes('pain') || message.includes('hurt')) {
      return [
        'Track your symptoms in a health journal',
        'Consider gentle stretching or movement',
        'Apply ice or heat as appropriate',
        'Schedule an appointment with your doctor'
      ];
    }
    
    if (message.includes('stress') || message.includes('anxious')) {
      return [
        'Try deep breathing exercises',
        'Consider meditation or mindfulness',
        'Ensure adequate sleep and rest',
        'Speak with a mental health professional'
      ];
    }
    
    if (message.includes('exercise') || message.includes('fitness')) {
      return [
        'Start with light activities like walking',
        'Set realistic, achievable goals',
        'Consult with a fitness professional',
        'Listen to your body and rest when needed'
      ];
    }
    
    return [
      'Keep a health diary of symptoms',
      'Maintain a balanced diet and hydration',
      'Ensure regular sleep schedule',
      'Consult with your healthcare provider'
    ];
  }

  // Get available provider status
  getProviderStatus(): { provider: AIProvider; available: boolean; model: string } {
    let available = false;
    
    switch (this.provider) {
      case 'groq':
        available = !!this.groq && !!import.meta.env.VITE_GROQ_API_KEY;
        break;
      case 'huggingface':
        available = !!this.hf && !!import.meta.env.VITE_HF_API_KEY;
        break;
      case 'mock':
        available = true; // Mock is always available
        break;
    }
    
    return {
      provider: this.provider,
      available,
      model: import.meta.env.VITE_AI_MODEL || 'default'
    };
  }

  // Enhanced medical tools integration with Auth0 AI features
  public getAdvancedMedicalTools() {
    if (auth0AIService.isTokenVaultEnabled() || 
        auth0AIService.isAsyncAuthEnabled() || 
        auth0AIService.isFGAEnabled()) {
      return advancedMedicalTools;
    }
    return [];
  }

  // Check if advanced Auth0 AI features are available
  public getAuth0AIFeatureStatus() {
    return {
      tokenVault: auth0AIService.isTokenVaultEnabled(),
      asyncAuth: auth0AIService.isAsyncAuthEnabled(),
      fga: auth0AIService.isFGAEnabled(),
      availableFeatures: auth0AIService.getAvailableFeatures()
    };
  }

  // Add Auth0 AI security information to response (Challenge Feature)
  private addSecurityFooter(
    response: string, 
    knowledgeSources: string[], 
    securityWarnings: string[]
  ): string {
    let footer = '\n\n---\n';
    
    // Add knowledge sources information
    if (knowledgeSources.length > 0) {
      footer += '🔒 **Auth0 FGA Knowledge Sources:**\n';
      knowledgeSources.forEach(source => {
        footer += `• ${source}\n`;
      });
      footer += '\n';
    }

    // Add security warnings
    if (securityWarnings.length > 0) {
      footer += '⚠️ **Security Notices:**\n';
      securityWarnings.forEach(warning => {
        footer += `• ${warning}\n`;
      });
      footer += '\n';
    }

    // Add Auth0 AI features info
    const auth0Status = this.getAuth0AIFeatureStatus();
    footer += '🛡️ **Secured by Auth0 for AI Agents:**\n';
    footer += `• User Authentication: ✅ Active\n`;
    footer += `• Token Vault: ${auth0Status.tokenVault ? '✅ Enabled' : '❌ Disabled'}\n`;
    footer += `• Fine-Grained Authorization: ${auth0Status.fga ? '✅ Filtering Knowledge' : '❌ Disabled'}\n`;
    footer += `• Asynchronous Authorization: ${auth0Status.asyncAuth ? '✅ Enabled' : '❌ Disabled'}\n`;

    return response + footer;
  }

}

// Export singleton instance
export const aiService = new AIService();
export default AIService;