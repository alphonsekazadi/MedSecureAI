# 🤖 AI API Setup Guide for MedSecureAI

## Quick Setup (5 minutes)

### Option 1: Groq (Recommended - FREE & FAST) ⚡

**Why Groq?**
- 🆓 **Free**: 14,400 requests/day
- ⚡ **Super Fast**: 500+ tokens/second  
- 🏥 **Medical-Friendly**: Great for health conversations
- 🛡️ **Reliable**: Enterprise-grade infrastructure

**Setup Steps:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up/Login with GitHub or Google
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy your API key

**Update your .env file:**
```env
VITE_GROQ_API_KEY=gsk_your_api_key_here
VITE_AI_PROVIDER=groq
VITE_AI_MODEL=llama-3.1-70b-versatile
```

---

### Option 2: Hugging Face (FREE Alternative) 🤗

**Setup Steps:**
1. Go to [huggingface.co](https://huggingface.co)
2. Create free account
3. Go to **Settings** → **Access Tokens**
4. Create **Read** token
5. Copy your token

**Update your .env file:**
```env
# VITE_GROQ_API_KEY=your_groq_key  # Comment out Groq
VITE_HF_API_KEY=hf_your_token_here
VITE_AI_PROVIDER=huggingface
VITE_AI_MODEL=microsoft/DialoGPT-medium
```

---

### Option 3: OpenAI (If Available) 🌟

**If you have OpenAI access:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account and add payment method
3. Go to **API Keys** section
4. Create new API key

**Update your .env file:**
```env
# VITE_GROQ_API_KEY=your_groq_key  # Comment out others
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_AI_PROVIDER=openai
VITE_AI_MODEL=gpt-3.5-turbo
```

---

## 🧪 Test Your Setup

1. **Save your .env file**
2. **Restart your dev server:**
   ```bash
   npm run dev
   ```
3. **Login to MedSecureAI**
4. **Go to AI Assistant tab**
5. **Try asking: "What are some tips for staying healthy?"**

---

## 🎯 Competition Tips

### Demo Messages for Judges
Try these example conversations to show off your AI:

**Health Education:**
- "What are the benefits of regular exercise?"
- "How can I improve my sleep quality?"
- "What should I know about managing stress?"

**Symptom Questions:**
- "I have a headache, what could help?"
- "I'm feeling anxious, what can I do?"
- "What are warning signs I should watch for?"

**Medical Guidance:**
- "When should I see a doctor?"
- "How do I prepare for a medical appointment?"
- "What questions should I ask my doctor?"

### Security Features to Highlight
1. **Auth0 Token Integration** - Every AI call uses secure tokens
2. **Medical Disclaimers** - AI provides safety warnings
3. **HIPAA Compliance** - Encrypted conversations
4. **Role-Based Access** - Only authenticated users can chat
5. **Audit Trails** - All interactions are logged

---

## 🔧 Troubleshooting

### "AI Service Not Available" Error
- Check your `.env` file has the correct API key
- Restart your development server
- Verify the API key is valid (test on provider website)

### API Rate Limits
- **Groq**: 14,400 requests/day (very generous)
- **Hugging Face**: Rate limited but usually sufficient for demos
- **OpenAI**: Pay-per-use (if available)

### Connection Errors
- Check your internet connection
- Verify API keys are correctly formatted
- Try a different AI provider

---

## 🏆 Why This Wins the Competition

### Technical Excellence
- **Multiple AI Providers**: Shows flexibility and reliability
- **Medical Safety**: Built-in disclaimers and safety prompts
- **Auth0 Integration**: Secure API calls with user tokens
- **Professional UI**: Medical-grade chat interface

### Real-World Value
- **Healthcare Focus**: Addresses actual medical AI security gaps
- **HIPAA Compliance**: Enterprise-ready security features
- **User Safety**: Prevents medical misuse with proper disclaimers
- **Scalability**: Can easily add more AI providers

### Emotional Impact
- **Patient Privacy**: Protects sensitive health conversations
- **Trust Building**: Professional medical interface design
- **Safety First**: Always directs users to healthcare professionals
- **Accessibility**: Easy-to-use health guidance for everyone

---

**🚀 Ready to impress the judges? Your MedSecureAI chat is now fully functional and secure!**