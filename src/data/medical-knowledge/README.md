# Medical Knowledge Base Index

This directory contains the medical knowledge base with Fine-Grained Authorization (FGA) capabilities for the Auth0 for AI Agents Challenge.

## Structure

### `/diagnostics/`
Medical diagnostic information and clinical decision support tools.
- **Access Level**: Doctor, Admin (minimum)
- **Specialization**: May require specific medical specializations
- **Sensitivity**: Medium to High

### `/treatments/`
Treatment protocols, therapy guidelines, and care management plans.
- **Access Level**: Doctor, Admin, Nurse (varies by content)
- **Patient Access**: Some lifestyle and general wellness content
- **Sensitivity**: Low to Medium

### `/medications/`
Pharmaceutical information, prescribing guidelines, and drug interactions.
- **Access Level**: Doctor, Admin, Pharmacist
- **Prescribing Authority**: Doctor, Nurse Practitioner (for prescribing info)
- **Sensitivity**: Medium to High

## Auth0 Fine-Grained Authorization Features

### Role-Based Access Control
- **Patient**: Limited access to educational and lifestyle content
- **Nurse**: Basic diagnostic and treatment information
- **Doctor**: Full access based on specialization
- **Pharmacist**: Medication information and interactions
- **Admin**: Full system access for management

### Specialization Requirements
- **Cardiology**: Heart conditions, cardiovascular medications
- **Endocrinology**: Diabetes, hormonal disorders
- **Internal Medicine**: General internal medicine conditions
- **Family Medicine**: Primary care and general practice
- **Emergency Medicine**: Acute care and emergency protocols

### Sensitivity Levels
- **Low**: General health information, lifestyle advice
- **Medium**: Standard medical information, common conditions
- **High**: Advanced diagnostics, controlled substances, sensitive protocols

## Implementation

The medical knowledge base is implemented using:
1. **Markdown Files**: Human-readable medical content with metadata
2. **Service Layer**: TypeScript service for parsing and access control
3. **FGA Integration**: Auth0 Fine-Grained Authorization checks
4. **Audit Logging**: Access attempts and authorization decisions

## Usage

```typescript
import { medicalKnowledgeService } from '../services/medicalKnowledgeService';

// Get accessible knowledge for current user
const knowledge = await medicalKnowledgeService.getAccessibleKnowledge(userContext);

// Search with FGA filtering
const results = await medicalKnowledgeService.searchKnowledge(query, userContext);

// Get specific item with authorization check
const item = await medicalKnowledgeService.getKnowledgeItem(id, userContext);
```

---

*This medical knowledge base demonstrates Auth0's Fine-Grained Authorization capabilities in a healthcare context, showing how sensitive medical information can be protected while maintaining appropriate access for healthcare professionals.*