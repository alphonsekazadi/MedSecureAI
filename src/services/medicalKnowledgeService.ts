// Medical Knowledge Base Service with Fine-Grained Authorization
// This service demonstrates Auth0's FGA capabilities by controlling access to medical knowledge

export interface MedicalKnowledgeMetadata {
  accessLevel: string[];
  specializationRequired?: string[];
  sensitivity: 'low' | 'medium' | 'high';
  patientAccessible?: boolean;
  prescribingAuthority?: string[];
  deaSchedule?: string;
  lastUpdated: string;
}

export interface MedicalKnowledgeItem {
  id: string;
  title: string;
  category: 'diagnostic' | 'treatment' | 'medication';
  content: string;
  metadata: MedicalKnowledgeMetadata;
  filePath: string;
}

export interface UserContext {
  role: 'patient' | 'doctor' | 'admin' | 'nurse' | 'pharmacist';
  specializations?: string[];
  permissions?: string[];
}

class MedicalKnowledgeService {
  private knowledgeBase: MedicalKnowledgeItem[] = [];
  private initialized = false;

  constructor() {
    this.initializeKnowledgeBase();
  }

  private async initializeKnowledgeBase(): Promise<void> {
    // In a real implementation, this would dynamically load and parse markdown files
    // For this demo, we'll use the static data we created
    
    this.knowledgeBase = [
      {
        id: 'diabetes-mellitus',
        title: 'Diabetes Mellitus Type 2',
        category: 'diagnostic',
        content: await this.loadMarkdownContent('/src/data/medical-knowledge/diagnostics/diabetes-mellitus.md'),
        metadata: {
          accessLevel: ['doctor', 'admin'],
          specializationRequired: ['endocrinology', 'internal-medicine', 'family-medicine'],
          sensitivity: 'medium',
          lastUpdated: '2025-10-12'
        },
        filePath: '/src/data/medical-knowledge/diagnostics/diabetes-mellitus.md'
      },
      {
        id: 'hypertension',
        title: 'Hypertension Management',
        category: 'diagnostic',
        content: await this.loadMarkdownContent('/src/data/medical-knowledge/diagnostics/hypertension.md'),
        metadata: {
          accessLevel: ['doctor', 'admin', 'nurse'],
          specializationRequired: ['cardiology', 'internal-medicine', 'family-medicine'],
          sensitivity: 'low',
          lastUpdated: '2025-10-12'
        },
        filePath: '/src/data/medical-knowledge/diagnostics/hypertension.md'
      },
      {
        id: 'metformin',
        title: 'Metformin (Glucophage)',
        category: 'medication',
        content: await this.loadMarkdownContent('/src/data/medical-knowledge/medications/metformin.md'),
        metadata: {
          accessLevel: ['doctor', 'admin', 'pharmacist'],
          prescribingAuthority: ['doctor', 'nurse-practitioner'],
          sensitivity: 'medium',
          deaSchedule: 'Non-controlled',
          lastUpdated: '2025-10-12'
        },
        filePath: '/src/data/medical-knowledge/medications/metformin.md'
      },
      {
        id: 'diabetes-lifestyle',
        title: 'Lifestyle Modifications for Diabetes Management',
        category: 'treatment',
        content: await this.loadMarkdownContent('/src/data/medical-knowledge/treatments/diabetes-lifestyle-management.md'),
        metadata: {
          accessLevel: ['doctor', 'admin', 'nurse', 'dietitian', 'patient'],
          specializationRequired: ['endocrinology', 'internal-medicine', 'family-medicine', 'nutrition'],
          sensitivity: 'low',
          patientAccessible: true,
          lastUpdated: '2025-10-12'
        },
        filePath: '/src/data/medical-knowledge/treatments/diabetes-lifestyle-management.md'
      }
    ];

    this.initialized = true;
  }

  private async loadMarkdownContent(filePath: string): Promise<string> {
    // For this demo, we'll return the actual markdown content
    // In a production environment, this would dynamically load files
    
    switch (filePath) {
      case '/src/data/medical-knowledge/medications/metformin.md':
        return `# Metformin (Glucophage)

**Auth0 FGA Metadata:**
- **Access Level:** \`doctor, admin, pharmacist\`
- **Prescribing Authority:** \`doctor, nurse-practitioner\`
- **Sensitivity:** \`medium\`
- **DEA Schedule:** \`Non-controlled\`
- **Last Updated:** \`2025-10-12\`

## Generic and Brand Names

- **Generic:** Metformin hydrochloride
- **Brand names:** Glucophage, Glucophage XR, Fortamet, Glumetza, Riomet

## Classification

- **Drug class:** Biguanide antidiabetic agent
- **Mechanism:** Decreases hepatic glucose production, improves insulin sensitivity

## Indications

### FDA-Approved Uses
- **Type 2 diabetes mellitus** (first-line therapy)
- **Pediatric type 2 diabetes** (≥10 years old)

### Off-Label Uses
- Polycystic ovary syndrome (PCOS)
- Weight management in obesity
- Prevention of diabetes in prediabetes

## Dosing and Administration

### Initial Dosing
- **Immediate-release:** 500 mg twice daily with meals
- **Extended-release:** 500-1000 mg once daily with evening meal

### Dose Titration
- Increase by 500 mg weekly or 850 mg every 2 weeks
- **Maximum dose:** 2,550 mg/day (immediate-release), 2,000 mg/day (extended-release)

### Renal Dosing
- **eGFR ≥45 mL/min/1.73m²:** No dose adjustment needed
- **eGFR 30-44 mL/min/1.73m²:** Consider dose reduction
- **eGFR <30 mL/min/1.73m²:** Contraindicated

## Contraindications

### Absolute Contraindications
- Severe kidney disease (eGFR <30 mL/min/1.73m²)
- Metabolic acidosis, including diabetic ketoacidosis
- Known hypersensitivity to metformin

## Monitoring Parameters

### Baseline Assessment
- Serum creatinine and eGFR
- Liver function tests
- Complete blood count
- Vitamin B12 level (consider baseline)

### Ongoing Monitoring
- **Renal function:** Every 3-6 months initially, then annually
- **Vitamin B12:** Annually (long-term use)
- **HbA1c:** Every 3 months until stable, then every 6 months

## Adverse Effects

### Common (>10%)
- Gastrointestinal upset (nausea, diarrhea, abdominal pain)
- Metallic taste
- Decreased appetite

### Less Common (1-10%)
- Vitamin B12 deficiency (long-term use)
- Lactic acidosis (rare but serious)

## Clinical Considerations

### Efficacy Data
- **HbA1c reduction:** 1.0-1.5% when used as monotherapy
- **Fasting glucose reduction:** 60-80 mg/dL
- **Weight neutral to modest weight loss:** 2-3 kg average

---

*Prescribing information based on current FDA labeling and clinical guidelines.*`;

      case '/src/data/medical-knowledge/diagnostics/diabetes-mellitus.md':
        return `# Diabetes Mellitus Type 2

**Auth0 FGA Metadata:**
- **Access Level:** \`doctor, admin\`
- **Specialization Required:** \`endocrinology, internal-medicine, family-medicine\`
- **Sensitivity:** \`medium\`
- **Last Updated:** \`2025-10-12\`

## Overview

Type 2 diabetes mellitus is a chronic metabolic disorder characterized by hyperglycemia resulting from defects in insulin secretion, insulin action, or both.

## Diagnostic Criteria

### Primary Diagnostic Tests
- **HbA1c ≥ 6.5%** (48 mmol/mol)
- **Fasting plasma glucose ≥ 126 mg/dL** (7.0 mmol/L)
- **2-hour plasma glucose ≥ 200 mg/dL** (11.1 mmol/L) during OGTT
- **Random plasma glucose ≥ 200 mg/dL** (11.1 mmol/L) with classic symptoms

### Supporting Laboratory Tests
- Fasting lipid profile
- Serum creatinine and eGFR
- Urinalysis with microscopy
- Thyroid function tests (TSH)
- Liver function tests

## Risk Factors

### Modifiable Risk Factors
- Obesity (BMI ≥ 30 kg/m²)
- Physical inactivity
- Unhealthy diet patterns
- Smoking
- Excessive alcohol consumption

### Non-Modifiable Risk Factors
- Age ≥ 45 years
- Family history of diabetes
- Ethnicity (African American, Hispanic, Native American, Asian American)
- History of gestational diabetes
- Polycystic ovary syndrome (PCOS)

## Clinical Decision Support

### Initial Management Algorithm
1. **Lifestyle interventions** (diet, exercise, weight management)
2. **Metformin** as first-line pharmacotherapy
3. **Individualized HbA1c targets** (generally <7% for most adults)
4. **Cardiovascular risk reduction** strategies

### Treatment Intensification
- Add second agent if HbA1c remains elevated after 3 months
- Consider patient-specific factors (kidney function, cardiovascular disease, weight)
- Monitor for hypoglycemia and other adverse effects

---

*This information is for healthcare professional use only and should not replace clinical judgment.*`;

      case '/src/data/medical-knowledge/diagnostics/hypertension.md':
        return `# Hypertension Management

**Auth0 FGA Metadata:**
- **Access Level:** \`doctor, admin, nurse\`
- **Specialization Required:** \`cardiology, internal-medicine, family-medicine\`
- **Sensitivity:** \`low\`
- **Last Updated:** \`2025-10-12\`

## Overview

Hypertension is a major cardiovascular risk factor affecting over 1 billion people worldwide. Proper diagnosis and management are crucial for preventing cardiovascular events.

## Classification (2017 ACC/AHA Guidelines)

| Category | Systolic (mmHg) | | Diastolic (mmHg) |
|----------|----------------|---|------------------|
| Normal | <120 | and | <80 |
| Elevated | 120-129 | and | <80 |
| Stage 1 | 130-139 | or | 80-89 |
| Stage 2 | ≥140 | or | ≥90 |
| Hypertensive Crisis | >180 | and/or | >120 |

## Diagnostic Workup

### Initial Assessment
- **Multiple BP measurements** on separate occasions
- **Complete history and physical examination**
- **Home BP monitoring** or 24-hour ambulatory monitoring
- **Assessment of cardiovascular risk factors**

### Laboratory Evaluation
- Complete blood count (CBC)
- Comprehensive metabolic panel
- Lipid profile
- Thyroid function tests
- Urinalysis with microscopy
- ECG

## Lifestyle Modifications

### DASH Diet Principles
- High in fruits, vegetables, whole grains
- Low in saturated fat, cholesterol, sodium
- Target: <2,300 mg sodium daily (ideal <1,500 mg)

### Physical Activity
- **Aerobic exercise:** 150 minutes moderate intensity weekly
- **Resistance training:** 2-3 sessions per week
- **Weight management:** Target BMI 18.5-24.9 kg/m²

## Pharmacotherapy

### First-Line Agents
1. **ACE Inhibitors** (e.g., lisinopril, enalapril)
2. **ARBs** (e.g., losartan, valsartan)
3. **Thiazide/Thiazide-like diuretics** (e.g., HCTZ, chlorthalidone)
4. **Calcium channel blockers** (e.g., amlodipine, nifedipine)

### Target Blood Pressure Goals
- **<130/80 mmHg** for most adults
- **<140/90 mmHg** for adults ≥65 years with high burden of comorbidity

---

*Guidelines based on 2017 ACC/AHA High Blood Pressure Clinical Practice Guideline.*`;

      case '/src/data/medical-knowledge/treatments/diabetes-lifestyle-management.md':
        return `# Lifestyle Modifications for Diabetes Management

**Auth0 FGA Metadata:**
- **Access Level:** \`doctor, admin, nurse, dietitian, patient\`
- **Specialization Required:** \`endocrinology, internal-medicine, family-medicine, nutrition\`
- **Sensitivity:** \`low\`
- **Patient Accessible:** \`true\`
- **Last Updated:** \`2025-10-12\`

## Overview

Lifestyle modifications are the cornerstone of diabetes management and can significantly improve glycemic control, reduce complications, and enhance quality of life.

## Medical Nutrition Therapy

### Carbohydrate Management
- **Carbohydrate counting:** 45-60g per meal for most adults
- **Glycemic index awareness:** Choose low-GI foods when possible
- **Consistent meal timing:** Helps with medication effectiveness
- **Portion control:** Use plate method (1/2 vegetables, 1/4 protein, 1/4 starch)

### Macronutrient Distribution
- **Carbohydrates:** 45-65% of total calories
- **Protein:** 15-20% of total calories (0.8-1.0 g/kg body weight)
- **Fat:** 20-35% of total calories (emphasize unsaturated fats)

## Physical Activity Guidelines

### Aerobic Exercise
- **Frequency:** At least 150 minutes moderate intensity per week
- **Distribution:** Spread over at least 3 days with no more than 2 consecutive days without activity
- **Examples:** Brisk walking, swimming, cycling, dancing

### Resistance Training
- **Frequency:** At least 2 sessions per week
- **Target:** All major muscle groups
- **Progression:** 8-10 exercises, 1-3 sets, 8-12 repetitions

## Weight Management

### Realistic Goals
- **Initial target:** 5-10% weight loss if overweight
- **Rate of loss:** 1-2 pounds per week
- **Maintenance:** Focus on preventing weight regain

### Behavioral Strategies
- **Self-monitoring:** Food diaries, weight tracking
- **Goal setting:** SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- **Problem-solving:** Identify barriers and solutions
- **Social support:** Family involvement, support groups

## Patient Education Points

1. Blood glucose self-monitoring techniques
2. Recognition of hypoglycemia symptoms
3. Proper medication administration
4. Lifestyle modification strategies
5. When to seek emergency care

---

*These lifestyle modifications should be individualized based on patient preferences, cultural background, and medical conditions.*`;

      default:
        return `Content not found for: ${filePath}`;
    }
  }

  // Fine-Grained Authorization: Check if user can access specific knowledge item
  private canAccessKnowledgeItem(item: MedicalKnowledgeItem, user: UserContext): boolean {
    // Check basic role access
    if (!item.metadata.accessLevel.includes(user.role)) {
      console.log(`FGA: Access denied - Role '${user.role}' not in allowed roles:`, item.metadata.accessLevel);
      return false;
    }

    // Check specialization requirements (for doctors)
    if (user.role === 'doctor' && item.metadata.specializationRequired && user.specializations) {
      const hasRequiredSpecialization = item.metadata.specializationRequired.some(spec => 
        user.specializations?.includes(spec)
      );
      if (!hasRequiredSpecialization) {
        console.log(`FGA: Access denied - Missing required specialization:`, item.metadata.specializationRequired);
        return false;
      }
    }

    // Check sensitivity level access
    if (item.metadata.sensitivity === 'high' && !['doctor', 'admin'].includes(user.role)) {
      console.log(`FGA: Access denied - High sensitivity content requires doctor or admin role`);
      return false;
    }

    // Additional prescribing authority check for medications
    if (item.category === 'medication' && item.metadata.prescribingAuthority) {
      // Only show prescribing information to authorized roles
      if (!item.metadata.prescribingAuthority.includes(user.role) && user.role !== 'admin') {
        console.log(`FGA: Limited access - Prescribing information restricted`);
        // Could return a filtered version of the content here
      }
    }

    console.log(`FGA: Access granted for user role '${user.role}' to '${item.title}'`);
    return true;
  }

  // Get knowledge items accessible to the current user
  public async getAccessibleKnowledge(user: UserContext): Promise<MedicalKnowledgeItem[]> {
    if (!this.initialized) {
      await this.initializeKnowledgeBase();
    }

    const accessibleItems = this.knowledgeBase.filter(item => 
      this.canAccessKnowledgeItem(item, user)
    );

    console.log(`FGA: User '${user.role}' has access to ${accessibleItems.length}/${this.knowledgeBase.length} knowledge items`);
    return accessibleItems;
  }

  // Search knowledge base with FGA filtering
  public async searchKnowledge(query: string, user: UserContext): Promise<MedicalKnowledgeItem[]> {
    const accessibleItems = await this.getAccessibleKnowledge(user);
    
    if (!query.trim()) {
      return accessibleItems;
    }

    const searchResults = accessibleItems.filter(item => {
      const searchText = `${item.title} ${item.content}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    console.log(`FGA: Search for '${query}' returned ${searchResults.length} results for user '${user.role}'`);
    return searchResults;
  }

  // Get specific knowledge item with FGA check
  public async getKnowledgeItem(id: string, user: UserContext): Promise<MedicalKnowledgeItem | null> {
    if (!this.initialized) {
      await this.initializeKnowledgeBase();
    }

    const item = this.knowledgeBase.find(item => item.id === id);
    if (!item) {
      return null;
    }

    if (!this.canAccessKnowledgeItem(item, user)) {
      console.log(`FGA: Access denied to knowledge item '${id}' for user '${user.role}'`);
      return null;
    }

    return item;
  }

  // Get knowledge categories accessible to user
  public async getAccessibleCategories(user: UserContext): Promise<string[]> {
    const accessibleItems = await this.getAccessibleKnowledge(user);
    const categories = [...new Set(accessibleItems.map(item => item.category))];
    return categories;
  }

  // Audit logging for FGA decisions
  public auditAccess(user: UserContext, itemId: string, accessGranted: boolean, reason?: string): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId: user.role, // In real implementation, would be actual user ID
      userRole: user.role,
      itemId,
      accessGranted,
      reason,
      specializations: user.specializations
    };

    console.log('FGA Audit Log:', auditLog);
    // In a real implementation, this would be sent to a secure audit logging system
  }

  // Admin function to get all knowledge items (bypasses FGA)
  public async getAllKnowledgeItems(): Promise<MedicalKnowledgeItem[]> {
    if (!this.initialized) {
      await this.initializeKnowledgeBase();
    }
    return this.knowledgeBase;
  }

  // Statistics for Auth0 challenge demo
  public async getAccessStats(user: UserContext): Promise<{
    totalItems: number;
    accessibleItems: number;
    accessPercentage: number;
    restrictedBy: string[];
  }> {
    const totalItems = this.knowledgeBase.length;
    const accessibleItems = await this.getAccessibleKnowledge(user);
    const accessPercentage = Math.round((accessibleItems.length / totalItems) * 100);
    
    // Determine what's restricting access
    const restrictedBy: string[] = [];
    const restrictedItems = this.knowledgeBase.filter(item => 
      !this.canAccessKnowledgeItem(item, user)
    );

    restrictedItems.forEach(item => {
      if (!item.metadata.accessLevel.includes(user.role)) {
        restrictedBy.push('Role-based access');
      }
      if (item.metadata.specializationRequired && user.role === 'doctor' && !user.specializations?.some(spec => item.metadata.specializationRequired?.includes(spec))) {
        restrictedBy.push('Specialization requirements');
      }
      if (item.metadata.sensitivity === 'high' && !['doctor', 'admin'].includes(user.role)) {
        restrictedBy.push('Sensitivity level');
      }
    });

    return {
      totalItems,
      accessibleItems: accessibleItems.length,
      accessPercentage,
      restrictedBy: [...new Set(restrictedBy)]
    };
  }
}

// Export singleton instance
export const medicalKnowledgeService = new MedicalKnowledgeService();
export default medicalKnowledgeService;