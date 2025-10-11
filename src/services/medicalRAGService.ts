// RAG Knowledge Management with Auth0 FGA Integration
// This service controls what medical knowledge the AI agent can access based on user roles

import { auth0AIService } from './auth0AIService';

export interface MedicalKnowledgeBase {
  id: string;
  category: 'patient_records' | 'medical_procedures' | 'drug_information' | 'emergency_protocols' | 'research_data';
  title: string;
  content: string;
  requiredRole: string[];
  sensitivityLevel: 'public' | 'professional' | 'restricted' | 'confidential';
  patientId?: string; // For patient-specific data
}

// Mock medical knowledge base with role-based access control
const medicalKnowledgeBase: MedicalKnowledgeBase[] = [
  // Public medical information - accessible to all
  {
    id: 'pub_001',
    category: 'drug_information',
    title: 'Acetaminophen (Tylenol) - Basic Information',
    content: 'Acetaminophen is a common over-the-counter pain reliever and fever reducer. Standard adult dose is 500-1000mg every 4-6 hours, not exceeding 3000mg per day. Do not exceed recommended dose to avoid liver damage.',
    requiredRole: ['patient', 'doctor', 'nurse', 'pharmacist'],
    sensitivityLevel: 'public'
  },
  {
    id: 'pub_002',
    category: 'medical_procedures',
    title: 'Basic First Aid for Cuts',
    content: 'For minor cuts: 1) Clean hands thoroughly, 2) Apply direct pressure to stop bleeding, 3) Clean wound with water, 4) Apply antibiotic ointment if available, 5) Cover with sterile bandage, 6) Monitor for signs of infection.',
    requiredRole: ['patient', 'doctor', 'nurse'],
    sensitivityLevel: 'public'
  },

  // Professional medical knowledge - doctors and nurses only
  {
    id: 'prof_001',
    category: 'drug_information',
    title: 'Morphine Sulfate - Clinical Guidelines',
    content: 'Morphine sulfate dosing for severe pain: Initial dose 10-30mg PO q4h or 2.5-15mg IV/IM q2-4h. Monitor respiratory depression, especially in elderly or opioid-naive patients. Contraindicated in severe respiratory depression, acute or severe bronchial asthma.',
    requiredRole: ['doctor', 'nurse'],
    sensitivityLevel: 'professional'
  },
  {
    id: 'prof_002',
    category: 'medical_procedures',
    title: 'Central Line Insertion Protocol',
    content: 'Central venous catheter insertion requires: Full sterile barrier precautions, ultrasound guidance when available, real-time confirmation of placement. Post-procedure chest X-ray mandatory to rule out pneumothorax and confirm tip position.',
    requiredRole: ['doctor'],
    sensitivityLevel: 'professional'
  },

  // Emergency protocols - medical staff only
  {
    id: 'emerg_001',
    category: 'emergency_protocols',
    title: 'Code Blue Response Protocol',
    content: 'ACLS Protocol: 1) Check responsiveness and pulse, 2) Begin CPR 30:2 compressions:ventilations, 3) Attach defibrillator/monitor, 4) Analyze rhythm, 5) If VF/VT: defibrillate 200J biphasic, 6) Resume CPR immediately, 7) Epinephrine 1mg IV/IO q3-5min.',
    requiredRole: ['doctor', 'nurse'],
    sensitivityLevel: 'restricted'
  },

  // Patient-specific records - highly restricted
  {
    id: 'pat_001',
    category: 'patient_records',
    title: 'Patient Medical History - John Doe',
    content: 'Patient ID: P-2025-001. Allergies: Penicillin (anaphylaxis), Shellfish (hives). Current medications: Lisinopril 10mg daily, Metformin 500mg BID. Recent lab values: HbA1c 7.2%, Creatinine 1.1 mg/dL. Last visit: Routine diabetes follow-up.',
    requiredRole: ['doctor', 'admin'],
    sensitivityLevel: 'confidential',
    patientId: 'P-2025-001'
  },

  // Research data - restricted access
  {
    id: 'res_001',
    category: 'research_data',
    title: 'Clinical Trial Data - Experimental Drug XYZ',
    content: 'Phase II trial results for Drug XYZ in Type 2 Diabetes: 45% reduction in HbA1c vs placebo (p<0.001). Adverse events: 12% GI upset, 3% hypoglycemia. Enrollment criteria: HbA1c >7.5%, no severe complications.',
    requiredRole: ['doctor', 'admin'],
    sensitivityLevel: 'restricted'
  }
];

export class MedicalRAGService {
  // Apply FGA to filter available knowledge based on user role and permissions
  public async getAuthorizedKnowledge(
    userId: string,
    userRole: string,
    query: string,
    _patientId?: string
  ): Promise<MedicalKnowledgeBase[]> {
    try {
      console.log(`🔍 RAG Query: "${query}" by ${userRole} user ${userId}`);

      // Filter knowledge based on role and FGA permissions
      const authorizedKnowledge: MedicalKnowledgeBase[] = [];

      for (const knowledge of medicalKnowledgeBase) {
        // Check if user role is authorized for this knowledge
        if (!knowledge.requiredRole.includes(userRole)) {
          console.log(`❌ FGA: Access denied to ${knowledge.id} - insufficient role`);
          continue;
        }

        // For patient-specific data, check FGA permissions
        if (knowledge.patientId) {
          const hasAccess = await auth0AIService.checkMedicalDataAccess(
            userId,
            'patient_records',
            knowledge.patientId,
            'read'
          );

          if (!hasAccess) {
            console.log(`❌ FGA: Access denied to patient data ${knowledge.patientId}`);
            continue;
          }
        }

        // Simple relevance scoring based on query
        const relevanceScore = this.calculateRelevance(query, knowledge);
        if (relevanceScore > 0.3) {
          authorizedKnowledge.push(knowledge);
          console.log(`✅ FGA: Authorized access to ${knowledge.id} (relevance: ${relevanceScore.toFixed(2)})`);
        }
      }

      // Sort by relevance and sensitivity (less sensitive first for patient safety)
      return authorizedKnowledge
        .sort((a, b) => {
          const sensitivityOrder = { 'public': 0, 'professional': 1, 'restricted': 2, 'confidential': 3 };
          return sensitivityOrder[a.sensitivityLevel] - sensitivityOrder[b.sensitivityLevel];
        })
        .slice(0, 5); // Limit to top 5 results

    } catch (error) {
      console.error('❌ RAG Service error:', error);
      return [];
    }
  }

  // Calculate relevance score between query and knowledge
  private calculateRelevance(query: string, knowledge: MedicalKnowledgeBase): number {
    const queryLower = query.toLowerCase();
    const titleLower = knowledge.title.toLowerCase();
    const contentLower = knowledge.content.toLowerCase();

    let score = 0;

    // Title matches are more important
    if (titleLower.includes(queryLower)) score += 1.0;
    
    // Check for keyword matches
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 0.3;
      if (contentLower.includes(word)) score += 0.1;
    }

    // Category relevance
    if (queryLower.includes('drug') || queryLower.includes('medication')) {
      if (knowledge.category === 'drug_information') score += 0.5;
    }
    if (queryLower.includes('procedure') || queryLower.includes('treatment')) {
      if (knowledge.category === 'medical_procedures') score += 0.5;
    }
    if (queryLower.includes('emergency') || queryLower.includes('urgent')) {
      if (knowledge.category === 'emergency_protocols') score += 0.5;
    }

    return Math.min(score, 1.0); // Cap at 1.0
  }

  // Generate AI response with FGA-filtered knowledge
  public async generateSecureResponse(
    userId: string,
    userRole: string,
    query: string,
    patientId?: string
  ): Promise<{
    response: string;
    knowledgeSources: string[];
    accessLevel: string;
    warnings: string[];
  }> {
    try {
      // Get authorized knowledge through FGA filtering
      const authorizedKnowledge = await this.getAuthorizedKnowledge(userId, userRole, query, patientId);
      
      const warnings: string[] = [];
      const knowledgeSources: string[] = [];

      if (authorizedKnowledge.length === 0) {
        return {
          response: `I don't have authorized access to information that would help answer your query "${query}". This may be due to:

• Your current role (${userRole}) doesn't have sufficient permissions
• The information requires higher authorization levels
• No relevant medical knowledge was found

Please consult with your healthcare provider or contact an administrator if you believe you should have access to this information.`,
          knowledgeSources: [],
          accessLevel: userRole,
          warnings: ['No authorized knowledge available for this query']
        };
      }

      // Build context from authorized knowledge
      let contextText = 'Based on your authorized medical knowledge access:\n\n';
      
      for (const knowledge of authorizedKnowledge) {
        contextText += `**${knowledge.title}** (${knowledge.sensitivityLevel} level):\n${knowledge.content}\n\n`;
        knowledgeSources.push(`${knowledge.title} [${knowledge.sensitivityLevel}]`);

        // Add warnings for sensitive information
        if (knowledge.sensitivityLevel === 'confidential') {
          warnings.push('Response contains confidential patient information - handle according to HIPAA guidelines');
        }
        if (knowledge.sensitivityLevel === 'restricted') {
          warnings.push('Response contains restricted medical information - professional use only');
        }
      }

      // Generate response based on filtered knowledge
      const response = `${contextText}

**Medical Assistant Response:**
Based on the authorized information available to your role (${userRole}), I can provide the following guidance regarding "${query}":

${this.generateMedicalGuidance(query, authorizedKnowledge)}

⚠️ **Medical Disclaimer:** This information is provided for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.

🔒 **Security Notice:** Your access to this information is governed by Auth0 Fine-Grained Authorization to ensure appropriate medical data access controls.`;

      return {
        response,
        knowledgeSources,
        accessLevel: userRole,
        warnings
      };

    } catch (error) {
      console.error('❌ Secure response generation failed:', error);
      return {
        response: 'I apologize, but I encountered an error while accessing the medical knowledge base. Please try again or contact technical support.',
        knowledgeSources: [],
        accessLevel: userRole,
        warnings: ['System error occurred during knowledge retrieval']
      };
    }
  }

  // Generate medical guidance based on filtered knowledge
  private generateMedicalGuidance(query: string, knowledge: MedicalKnowledgeBase[]): string {
    if (knowledge.length === 0) return 'No authorized information available.';

    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('dose') || queryLower.includes('dosage')) {
      const drugInfo = knowledge.filter(k => k.category === 'drug_information');
      if (drugInfo.length > 0) {
        return `For dosage information: ${drugInfo[0].content.split('.')[1] || drugInfo[0].content}. Please verify with current prescribing guidelines and consider patient-specific factors.`;
      }
    }

    if (queryLower.includes('procedure') || queryLower.includes('how to')) {
      const procedures = knowledge.filter(k => k.category === 'medical_procedures');
      if (procedures.length > 0) {
        return `Procedure guidance: ${procedures[0].content}. Ensure proper training and certification before performing any medical procedures.`;
      }
    }

    if (queryLower.includes('emergency')) {
      const emergency = knowledge.filter(k => k.category === 'emergency_protocols');
      if (emergency.length > 0) {
        return `Emergency protocol: ${emergency[0].content}. In life-threatening situations, immediately call emergency services (911).`;
      }
    }

    // Default response using first available knowledge
    return `${knowledge[0].content}. Please consult current medical literature and your institution's protocols for the most up-to-date information.`;
  }

  // Get user's knowledge access summary
  public async getUserKnowledgeAccess(_userId: string, userRole: string): Promise<{
    accessibleCategories: string[];
    restrictedCategories: string[];
    totalKnowledge: number;
    accessibleKnowledge: number;
  }> {
    const accessibleCategories: string[] = [];
    const restrictedCategories: string[] = [];
    let accessibleCount = 0;

    const categories = ['patient_records', 'medical_procedures', 'drug_information', 'emergency_protocols', 'research_data'];
    
    for (const category of categories) {
      const categoryKnowledge = medicalKnowledgeBase.filter(k => k.category === category);
      const accessible = categoryKnowledge.filter(k => k.requiredRole.includes(userRole));
      
      if (accessible.length > 0) {
        accessibleCategories.push(category);
        accessibleCount += accessible.length;
      } else {
        restrictedCategories.push(category);
      }
    }

    return {
      accessibleCategories,
      restrictedCategories,
      totalKnowledge: medicalKnowledgeBase.length,
      accessibleKnowledge: accessibleCount
    };
  }
}

// Export singleton instance
export const medicalRAGService = new MedicalRAGService();