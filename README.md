# 🏥 MedSecureAI - Secure Healthcare AI Assistant

[![Auth0](https://img.shields.io/badge/Auth0-Integrated-orange?logo=auth0)](https://auth0.com)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-AI%20Powered-yellow?logo=huggingface)](https://huggingface.co)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

**MedSecureAI** is a HIPAA-compliant healthcare AI assistant built for the **Auth0 for AI Agents Challenge**. It provides secure, role-based access to AI-powered health information with enterprise-grade authentication and medical safety protocols.

## 🏆 Auth0 Challenge Features

- **🔐 Auth0 for AI Agents Integration**: Complete implementation with medical tenant configuration
- **🤖 Multi-Provider AI**: HuggingFace, Groq integration with medical safety protocols  
- **👥 Role-Based Authentication**: Patient, Doctor, Admin roles with secure access control
- **🛡️ HIPAA Compliance**: Encrypted messaging, audit trails, medical disclaimers
- **⚕️ Medical Safety**: AI responses with proper medical disclaimers and safety guidelines

## ✨ Key Features

### 🔒 **Secure Authentication**
- Auth0 integration with medical tenant (`my-ai-agent.us.auth0.com`)
- Role-based access control (Patient/Doctor/Admin)
- Secure token management for AI API calls
- Medical-grade security protocols

### 🤖 **AI-Powered Health Assistant**
- **HuggingFace Integration**: Swiss AI Apertus-8B-Instruct model via PublicAI
- **Groq Integration**: Llama 3.1 70B for advanced healthcare queries  
- **Medical Safety**: HIPAA-compliant responses with appropriate disclaimers
- **Intelligent Fallbacks**: Graceful error handling with health-focused responses

### 🏥 **Medical Interface**
- Professional medical UI with Tailwind CSS
- Encrypted chat interface with security indicators
- Role-specific dashboards for different user types
- Mobile-responsive design for healthcare professionals

### 🔧 **Technical Excellence**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Modern Architecture**: Component-based with custom hooks
- **Error Boundaries**: Robust error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Auth0 account with AI Agents features enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/MedSecureAI.git
   cd MedSecureAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your credentials:
   ```env
   # Auth0 Configuration
   VITE_AUTH0_DOMAIN=my-ai-agent.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id
   VITE_AUTH0_AUDIENCE=https://medsecureai-api

   # AI Provider Selection
   VITE_AI_PROVIDER=huggingface

   # HuggingFace Configuration (Recommended)
   VITE_HF_API_KEY=your_huggingface_token
   VITE_HUGGINGFACE_MODEL=swiss-ai/Apertus-8B-Instruct-2509

   # Optional: Groq Configuration
   VITE_GROQ_API_KEY=your_groq_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── auth/                   # Auth0 integration
│   ├── Auth0ProviderWrapper.tsx
│   └── useAuth.ts         # Custom auth hook
├── components/            # UI Components
│   ├── LandingPage.tsx   # Medical landing page
│   ├── PatientDashboard.tsx
│   ├── DoctorDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── SecureAIChat.tsx  # HIPAA-compliant chat
├── services/             # Business Logic
│   └── aiService.ts      # Multi-provider AI service
├── App.tsx               # Main application
└── main.tsx             # Entry point
```

## 🔧 Configuration

### Auth0 Setup

1. **Create Auth0 Application**
   - Application Type: Single Page Application
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
   - Enable Auth0 for AI Agents features

2. **Configure User Roles**
   - Patient: Basic health information access
   - Doctor: Enhanced medical tools and patient data
   - Admin: System administration and analytics

3. **Set Auth0 Rules** (Optional)
   Configure custom claims for user roles in Auth0 Rules/Actions.

### AI Provider Setup

#### HuggingFace (Recommended)
- Sign up at [HuggingFace](https://huggingface.co)
- Generate API token in Settings → Access Tokens
- Uses PublicAI provider with Swiss AI models

#### Groq (Alternative)
- Sign up at [Groq](https://console.groq.com)
- Generate API key for Llama model access
- High-performance inference for complex queries

## 🛡️ Security Features

### HIPAA Compliance
- **Encrypted Communications**: All chat messages encrypted
- **Audit Trails**: User actions logged for compliance
- **Medical Disclaimers**: Automatic safety warnings
- **Access Controls**: Role-based data access

### Auth0 Security
- **Secure Token Storage**: JWT tokens with refresh
- **Multi-Factor Authentication**: Optional 2FA setup
- **Session Management**: Automatic token refresh
- **Medical Tenant**: Specialized Auth0 configuration

## 🤖 AI Integration Details

### Supported Providers

| Provider | Model | Use Case | Status |
|----------|--------|----------|--------|
| HuggingFace | Swiss AI Apertus-8B | General health queries | ✅ Active |
| Groq | Llama 3.1 70B | Complex medical analysis | ✅ Active |
| Mock | Development | Testing without API keys | ✅ Active |

### Medical Safety Protocols

- **Automatic Disclaimers**: All responses include medical safety warnings
- **Symptom Guidance**: Recommends professional consultation for symptoms
- **Emergency Detection**: Identifies urgent medical situations  
- **Medication Warnings**: Never provides specific drug recommendations

## 🎯 Use Cases

### For Patients
- General health information and education
- Wellness tips and preventive care guidance
- Understanding medical terminology
- Pre-appointment preparation

### For Healthcare Professionals
- Quick reference for general medical information
- Patient education material assistance
- Health screening questionnaire support
- Medical documentation insights

### For Administrators
- System monitoring and user analytics
- Compliance reporting and audit trails
- AI performance metrics and optimization
- Security incident management

## 🔨 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Adding New Features

1. **New AI Providers**: Extend `aiService.ts` with additional providers
2. **User Roles**: Update role definitions in `useAuth.ts`
3. **Medical Components**: Add specialized healthcare UI components
4. **Compliance Features**: Enhance HIPAA compliance tools

## 📱 Deployment

### Production Build
```bash
npm run build
```

### Deployment Platforms
- **Vercel**: Recommended for React apps (configure Auth0 production URLs)
- **Netlify**: Alternative with Auth0 integration
- **AWS S3**: Static hosting with CloudFront CDN
- **Azure Static Apps**: Enterprise-grade hosting

### Environment Configuration
Update Auth0 configuration for production domains:
- Allowed Callback URLs: `https://your-domain.com`
- Allowed Web Origins: `https://your-domain.com`

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[AI Setup Guide](docs/AI_SETUP_GUIDE.md)** - Detailed AI provider configuration
- **[Auth0 Setup](docs/AUTH0_SETUP.md)** - Complete Auth0 integration guide  
- **[Quick Fix Guide](docs/QUICK_FIX.md)** - Common issues and solutions
- **[Demo Ready](docs/DEMO_READY.md)** - Auth0 Challenge submission checklist
- **[Setup Instructions](docs/INSTRUCTIONS.md)** - Step-by-step project setup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/medical-feature`)
3. Commit changes (`git commit -m 'Add medical feature'`)
4. Push to branch (`git push origin feature/medical-feature`)  
5. Open Pull Request

See [contributing guidelines](docs/INSTRUCTIONS.md) for detailed development setup.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Auth0** for AI Agents Challenge and authentication platform
- **HuggingFace** for AI model inference and PublicAI provider
- **Groq** for high-performance AI inference
- **React Community** for excellent tooling and ecosystem
- **Healthcare Professionals** for medical safety guidance

---

**Built for the Auth0 for AI Agents Challenge 2024** 🏆  
*Secure • Compliant • Intelligent • Trustworthy*
