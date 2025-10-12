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
    // In a real implementation, this would fetch and parse the markdown file
    // For this demo, we'll return a placeholder that indicates the content would be loaded
    return `Content loaded from ${filePath}`;
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