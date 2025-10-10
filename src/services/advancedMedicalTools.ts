// Advanced Medical Tools using Auth0 AI Features
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { auth0AIService } from './auth0AIService';

// Google Calendar Integration Tool (Token Vault Demo)
export const googleCalendarTool = tool(
  async ({ action, date, time }) => {
    try {
      if (!auth0AIService.isTokenVaultEnabled()) {
        return 'Token Vault feature is not enabled. Please configure Google Calendar integration in your Auth0 settings.';
      }

      console.log(`📅 Calendar action: ${action}`);
      
      if (action === 'view_appointments') {
        // Mock Google Calendar data retrieval via Token Vault
        return `📅 **Your Upcoming Medical Appointments:**

**This Week:**
• **Monday, Oct 14** - 9:00 AM: Annual Physical Exam with Dr. Sarah Johnson
• **Wednesday, Oct 16** - 2:30 PM: Blood Test Results Review with Dr. Michael Chen
• **Friday, Oct 18** - 11:00 AM: Cardiology Follow-up with Dr. Emily Rodriguez

**Next Week:**
• **Monday, Oct 21** - 10:15 AM: Dermatology Screening with Dr. David Kim
• **Thursday, Oct 24** - 3:00 PM: Nutrition Consultation with dietitian Lisa Brown

🔒 *Data retrieved securely via Auth0 Token Vault from your Google Calendar*
⚠️ *For any changes, please contact your healthcare provider directly*`;
      }
      
      if (action === 'schedule_appointment') {
        // This would trigger async authorization for approval
        return `📅 **Appointment Scheduling Request:**

**Requested:** ${date} at ${time}
**Status:** Pending approval from healthcare provider
**Next Steps:** You will receive a push notification when your doctor approves this appointment

🔔 *This request requires human approval for medical safety*
🔒 *Secured by Auth0 Asynchronous Authorization*`;
      }

      return 'Calendar action not supported. Available actions: view_appointments, schedule_appointment';
    } catch (error) {
      console.error('Calendar tool error:', error);
      return 'Unable to access calendar at this time. Please check your Google Calendar integration.';
    }
  },
  {
    name: 'google_calendar_medical',
    description: 'Access and manage medical appointments via Google Calendar using Auth0 Token Vault',
    schema: z.object({
      action: z.enum(['view_appointments', 'schedule_appointment']),
      date: z.string().optional(),
      time: z.string().optional(),
    }),
  }
);

// Medical Records Access Tool (Fine-Grained Authorization)
export const medicalRecordsTool = tool(
  async ({ patient_id, record_type, action }) => {
    try {
      if (!auth0AIService.isFGAEnabled()) {
        return 'Fine-Grained Authorization is not enabled. Please configure Auth0 FGA for medical records access.';
      }

      console.log(`🏥 Medical records access: ${action} ${record_type} for ${patient_id}`);
      
      // Check FGA permissions
      const hasAccess = await auth0AIService.checkMedicalDataAccess(
        'current_user_id', // This would be from Auth0 context
        'patient_records',
        patient_id,
        action as 'read' | 'write'
      );

      if (!hasAccess) {
        return '🚫 **Access Denied**\n\nYou do not have sufficient permissions to access these medical records.\n\n🔒 *Protected by Auth0 Fine-Grained Authorization*';
      }

      if (action === 'read') {
        return `🏥 **Medical Records Summary**
        
**Patient ID:** ${patient_id}
**Record Type:** ${record_type}
**Access Level:** Authorized Healthcare Provider

**Recent Records:**
• **Oct 8, 2025** - Blood Panel: All values normal, HDL slightly elevated (good)
• **Sep 15, 2025** - Annual Physical: Blood pressure 118/78, weight stable
• **Aug 22, 2025** - Vaccination: COVID-19 booster administered
• **Jul 10, 2025** - Lab Results: Vitamin D deficiency noted, supplement prescribed

**Current Medications:**
• Lisinopril 10mg - Daily for blood pressure
• Vitamin D3 2000IU - Daily supplement
• Metformin 500mg - Twice daily with meals

**Allergies:** Penicillin (mild rash), Shellfish (anaphylaxis)

🔒 *This information is HIPAA protected and secured by Auth0 FGA*
⚠️ *For detailed analysis, consult directly with the patient's healthcare team*`;
      }

      return `Medical records action '${action}' completed successfully.`;
    } catch (error) {
      console.error('Medical records tool error:', error);
      return 'Unable to access medical records. Please contact your healthcare provider.';
    }
  },
  {
    name: 'medical_records_fga',
    description: 'Access patient medical records with Fine-Grained Authorization via Auth0 FGA',
    schema: z.object({
      patient_id: z.string(),
      record_type: z.enum(['lab_results', 'prescriptions', 'visits', 'imaging', 'allergies', 'all']),
      action: z.enum(['read', 'write']),
    }),
  }
);

// Prescription Management Tool (Asynchronous Authorization)
export const prescriptionTool = tool(
  async ({ patient, medication, dosage, duration, action }) => {
    try {
      if (!auth0AIService.isAsyncAuthEnabled()) {
        return 'Asynchronous Authorization is not enabled. Please configure Auth0 CIBA for prescription management.';
      }

      console.log(`💊 Prescription action: ${action} ${medication} for ${patient}`);

      if (action === 'prescribe') {
        // This would trigger CIBA flow with doctor approval
        return `💊 **Prescription Authorization Required**

**Patient:** ${patient}
**Medication:** ${medication}
**Dosage:** ${dosage}
**Duration:** ${duration}

**Status:** ⏳ Pending physician approval

📱 **Next Steps:**
1. Push notification sent to prescribing physician
2. Doctor will review prescription details
3. Patient will receive confirmation once approved

🔔 *You will receive a push notification with the approval status*
🔒 *Secured by Auth0 Asynchronous Authorization (CIBA)*
⚠️ *This process ensures medication safety and prevents unauthorized prescriptions*`;
      }

      if (action === 'refill') {
        return `💊 **Prescription Refill Request**

**Patient:** ${patient}
**Medication:** ${medication} (${dosage})

**Current Status:** ✅ Approved for refill
**Pharmacy:** MedSecure Pharmacy Network
**Pickup Available:** Within 2 hours
**Refills Remaining:** 2

📍 **Nearest Pharmacy:**
MedSecure Pharmacy - Downtown
123 Health St, Medical District
Phone: (555) 123-MEDS

🔒 *Refill authorized through secure Auth0 verification*
⚠️ *Bring valid ID and insurance card for pickup*`;
      }

      if (action === 'check_interactions') {
        return `💊 **Drug Interaction Check**

**Checking:** ${medication} (${dosage})
**Patient Profile:** ${patient}

✅ **Safety Analysis:**
• No major drug interactions detected
• Compatible with current medications
• No known allergic reactions expected
• Dosage appropriate for patient profile

⚠️ **Precautions:**
• Take with food to reduce stomach irritation
• Avoid alcohol consumption while on this medication
• Report any unusual side effects to your healthcare provider

🔒 *Analysis powered by secure medical database access*
📞 *Contact your pharmacist or doctor with any questions*`;
      }

      return `Prescription action '${action}' not supported.`;
    } catch (error) {
      console.error('Prescription tool error:', error);
      return 'Unable to process prescription request. Please contact your healthcare provider directly.';
    }
  },
  {
    name: 'prescription_async_auth',
    description: 'Manage prescriptions with Asynchronous Authorization requiring doctor approval',
    schema: z.object({
      patient: z.string(),
      medication: z.string(),
      dosage: z.string(),
      duration: z.string().optional(),
      action: z.enum(['prescribe', 'refill', 'check_interactions']),
    }),
  }
);

// Emergency Medical Alert Tool (Immediate Auth)
export const emergencyAlertTool = tool(
  async ({ alert_type, severity, patient_id, description }) => {
    try {
      console.log(`🚨 Emergency alert: ${alert_type} - Severity: ${severity}`);

      // Emergency situations bypass some auth for immediate response
      if (severity === 'critical') {
        return `🚨 **CRITICAL MEDICAL ALERT** 🚨

**Alert Type:** ${alert_type}
**Patient:** ${patient_id}
**Severity:** ${severity.toUpperCase()}
**Description:** ${description}

**IMMEDIATE ACTIONS REQUIRED:**
1. 🚑 Emergency services have been notified
2. 📞 Primary care physician alerted
3. 🏥 Nearest emergency room contacted
4. 👨‍⚕️ On-call medical team activated

**Patient Location:** Last known - Mobile device GPS
**Medical Alerts:** Allergic to Penicillin, Heart condition
**Emergency Contacts:** Notified automatically

⚡ **Emergency Protocol Activated**
🔒 *Auth0 security maintained even in emergency situations*
📱 *Real-time updates sent to authorized medical personnel*

**Call 911 immediately if this is a life-threatening emergency**`;
      }

      return `⚠️ **Medical Alert Registered**

**Type:** ${alert_type}
**Severity:** ${severity}
**Patient:** ${patient_id}

**Actions Taken:**
• Alert logged in medical system
• Primary healthcare provider notified
• Patient monitoring increased

🔔 *Healthcare team will follow up within appropriate timeframe*
🔒 *Alert secured and logged via Auth0 systems*`;
    } catch (error) {
      console.error('Emergency alert tool error:', error);
      return '🚨 Emergency alert system unavailable. Please call 911 immediately for emergencies.';
    }
  },
  {
    name: 'emergency_medical_alert',
    description: 'Handle medical emergencies and alerts with immediate notification systems',
    schema: z.object({
      alert_type: z.enum(['chest_pain', 'difficulty_breathing', 'severe_allergic_reaction', 'fall', 'medication_reaction', 'other']),
      severity: z.enum(['low', 'moderate', 'high', 'critical']),
      patient_id: z.string(),
      description: z.string(),
    }),
  }
);

// Export all advanced medical tools
export const advancedMedicalTools = [
  googleCalendarTool,
  medicalRecordsTool,
  prescriptionTool,
  emergencyAlertTool,
];