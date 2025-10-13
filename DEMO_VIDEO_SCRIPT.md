# 🎬 MedSecureAI Demo Video Script

**Duration**: 3-4 minutes  
**URL**: https://medsecureai.vercel.app/

---

## **Opening (30 seconds)**

"Hello, I'm Alphonse Kazadi, and this is MedSecureAI - my submission for the Auth0 for AI Agents Challenge.

MedSecureAI is a HIPAA-compliant healthcare AI assistant that demonstrates all three core pillars of Auth0's security framework: Authentication, Token Vault, and Fine-Grained Authorization.

Let me show you how these work together in a real healthcare environment."

---

## **Scene 1: Landing Page & Authentication (45 seconds)**

[Navigate to https://medsecureai.vercel.app/]

"First, let's see the landing page with its modern glassmorphism design."

[Point to the UI elements]

"Notice the professional medical interface designed for healthcare professionals. Now let's demonstrate Auth0's authentication pillar."

[Click "Login with Auth0"]

"The authentication uses Auth0's React SDK with PKCE flow, supporting multiple healthcare roles: Patient, Doctor, and Admin."

[Complete login process]

"Perfect! I'm now logged in as [your role]. Notice how the UI theme changes based on my role - this is part of the security design."

---

## **Scene 2: Role-Based Interface (30 seconds)**

[Show the dashboard]

"Each role gets a different interface design:
- Patients see a blue theme with basic health information
- Doctors get a green theme with advanced medical tools  
- Admins have a purple theme with full system access

This visual security helps users understand their permission level immediately."

---

## **Scene 3: Auth0 Challenge Demo - Pillar 1 (45 seconds)**

[Navigate to "Auth0 Challenge Demo" tab]

"Now let's test all three Auth0 AI pillars. This interactive demo shows exactly how they work."

[Click "User Authentication" button]

"Pillar 1: Authentication - 'Secure the Human'. Here you can see my authenticated user details, role assignment, and session security information. Auth0 handles the complete authentication flow with proper medical safety protocols."

[Read some of the output]

"Notice it shows my role, permissions, and security status - this is the foundation for all AI agent interactions."

---

## **Scene 4: Token Vault Demo (45 seconds)**

[Click "Token Vault" button]

"Pillar 2: Token Vault - 'Control the Tools'. This demonstrates how AI agents can securely access third-party APIs on behalf of users."

[Wait for the demo to run]

"You can see it's simulating secure access to Google Calendar API using Auth0's Token Vault. The system retrieves OAuth tokens securely, makes API calls, and maintains audit trails. This is crucial for healthcare integrations with EHR systems, calendars, and other medical APIs."

---

## **Scene 5: Fine-Grained Authorization (45 seconds)**

[Click "Fine-Grained Auth" button]

"Pillar 3: Fine-Grained Authorization - 'Limit Knowledge'. This is where it gets really interesting for healthcare."

[Wait for the demo to run, point to results]

"See how my access to medical knowledge is filtered based on my role and specialization. The system shows exactly which medical documents I can access and which are restricted. This implements real healthcare compliance - a cardiologist only sees cardiology content, patients see general health information."

---

## **Scene 6: AI Agent in Action (45 seconds)**

[Navigate to "AI Assistant" tab]

"Now let's see the AI agent working with this secure knowledge base."

[Type a medical question like "Tell me about diabetes management"]

"I'll ask about diabetes management..."

[Show the AI response]

"Notice how the AI provides medical information with proper disclaimers, and shows which knowledge sources it accessed based on my permissions. The AI agent respects the Fine-Grained Authorization we just saw."

[Point to the "Available Documents" section]

"See here - it shows I have access to [X] documents based on my role. This is FGA in action."

---

## **Scene 7: Medical Knowledge Browser (30 seconds)**

[Navigate to "Medical Knowledge" tab]

"Let's look at the knowledge base directly. Here you can see the medical documents with role-based filtering."

[Browse through available documents]

"Each document has specific access controls - some are for all users, others require medical professional credentials. This ensures patients only see appropriate content while doctors get comprehensive medical information."

---

## **Closing (30 seconds)**

"MedSecureAI demonstrates how Auth0's AI Agents framework enables secure, compliant AI systems in critical industries like healthcare.

All three pillars work together:
- Authentication secures the users
- Token Vault manages API integrations safely  
- Fine-Grained Authorization protects sensitive medical knowledge

This isn't just a demo - it's a blueprint for the future of secure healthcare AI.

You can test everything yourself at medsecureai.vercel.app, and the complete source code is available on GitHub.

Thank you for watching!"

---

## **Technical Notes for Recording**

- **Screen Resolution**: Use 1920x1080 for crisp video
- **Browser**: Chrome or Firefox, ensure no browser extensions visible
- **Audio**: Clear microphone, speak slowly and clearly
- **Pacing**: Pause briefly between sections to let viewers absorb information
- **Cursor**: Use a cursor highlighter tool to make clicks visible
- **Backup Plan**: If live demo fails, have screenshots ready

## **Key Points to Emphasize**

1. **All 3 Auth0 pillars implemented and working**
2. **Real healthcare use case with actual security needs**
3. **Interactive demo that viewers can test themselves**
4. **Production-ready code with proper architecture**
5. **Visual security indicators (role-based theming)**

---

## **Alternative Short Script (2 minutes)**

### **Quick Opening (15 seconds)**
"I'm Alphonse Kazadi. This is MedSecureAI - demonstrating all three Auth0 AI Agents pillars in a real healthcare application."

### **Live Demo (90 seconds)**
1. **Show landing page** (15s): "Professional medical interface with Auth0 login"
2. **Login & role theming** (20s): "Role-based authentication with visual security indicators"  
3. **Auth0 Challenge Demo** (30s): "Interactive test of all three pillars - Authentication, Token Vault, and Fine-Grained Authorization"
4. **AI Agent** (15s): "AI assistant with secure knowledge base access"
5. **Knowledge Browser** (10s): "Medical documents with role-based filtering"

### **Quick Closing (15 seconds)**
"All three Auth0 pillars working together for secure healthcare AI. Test it yourself at medsecureai.vercel.app"

---

## **What Makes This Demo Stand Out**

- **Interactive**: Viewers can test everything themselves
- **Real Use Case**: Healthcare security is critical and relevant
- **Complete Implementation**: All 3 Auth0 pillars fully working
- **Professional Quality**: Production-ready application, not just a proof of concept
- **Visual Security**: Role-based theming makes security visible and trustworthy