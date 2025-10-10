# 🚀 Quick Fix: Get Groq API (30 seconds setup)

## The Issue
Hugging Face models can be unreliable through their API. **Groq is much better and FREE!**

## 🏆 Solution: Get FREE Groq API Key

### Step 1: Get Groq API Key (30 seconds)
1. Go to: [console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub (instant)
3. Click **"API Keys"** in sidebar
4. Click **"Create API Key"** 
5. Copy the key (starts with `gsk_...`)

### Step 2: Update Your .env File
Replace your current AI configuration with:

```env
# AI API Configuration - Groq (FAST & RELIABLE)
VITE_GROQ_API_KEY=gsk_your_actual_api_key_here
VITE_AI_PROVIDER=groq
VITE_AI_MODEL=llama-3.1-70b-versatile

# Backup: Hugging Face (comment out when using Groq)
# VITE_HF_API_KEY=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
# VITE_AI_PROVIDER=huggingface  
# VITE_AI_MODEL=mistralai/Mistral-7B-Instruct-v0.1
```

### Step 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🎯 Why Groq is Better

- ✅ **Reliable**: 99.9% uptime
- ✅ **Fast**: 500+ tokens/second  
- ✅ **Free**: 14,400 requests/day
- ✅ **Medical-Friendly**: Perfect for health conversations
- ✅ **No Model Issues**: Always available

## 🧪 Test Your Setup

Try asking: "What are some tips for staying healthy?"

You should get a fast, intelligent response!

---

**🚀 With Groq, your MedSecureAI will impress the judges with lightning-fast AI responses!**