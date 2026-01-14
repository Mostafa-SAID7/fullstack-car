import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DiagnosticStep {
  id: number;
  title: string;
  description: string;
  type: 'question' | 'symptom' | 'inspection' | 'result';
  completed: boolean;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  answer?: string | string[];
}

export interface DiagnosticResult {
  diagnosis: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  possibleCauses: string[];
  recommendedActions: string[];
  estimatedCost?: string;
  urgency: string;
  diyPossible: boolean;
  diyInstructions?: string[];
}

export interface DiagnosticEvent {
  type: 'complete' | 'cancel' | 'find-mechanic' | 'view-diy';
  result?: DiagnosticResult;
}

@Component({
  selector: 'app-diagnostic-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnostic-wizard.component.html',
  styleUrls: ['./diagnostic-wizard.component.scss']
})
export class DiagnosticWizardComponent {
  @Output() diagnosticAction = new EventEmitter<DiagnosticEvent>();

  currentStep: number = 1;
  totalSteps: number = 4;
  
  steps: DiagnosticStep[] = [
    {
      id: 1,
      title: 'Symptoms',
      description: 'Describe what you\'re experiencing',
      type: 'symptom',
      completed: false
    },
    {
      id: 2,
      title: 'Questions',
      description: 'Answer a few questions',
      type: 'question',
      completed: false
    },
    {
      id: 3,
      title: 'Inspection',
      description: 'Visual inspection checklist',
      type: 'inspection',
      completed: false
    },
    {
      id: 4,
      title: 'Results',
      description: 'Diagnosis and recommendations',
      type: 'result',
      completed: false
    }
  ];

  // Step 1: Symptoms
  selectedSymptoms: string[] = [];
  symptomCategories = [
    {
      name: 'Engine',
      symptoms: [
        'Engine won\'t start',
        'Rough idle',
        'Loss of power',
        'Check engine light',
        'Strange noises',
        'Overheating'
      ]
    },
    {
      name: 'Brakes',
      symptoms: [
        'Squeaking/squealing',
        'Grinding noise',
        'Soft brake pedal',
        'Vibration when braking',
        'Brake warning light',
        'Pulling to one side'
      ]
    },
    {
      name: 'Transmission',
      symptoms: [
        'Slipping gears',
        'Delayed shifting',
        'Grinding when shifting',
        'Leaking fluid',
        'Burning smell',
        'Check transmission light'
      ]
    },
    {
      name: 'Electrical',
      symptoms: [
        'Battery warning light',
        'Dim lights',
        'Electrical accessories not working',
        'Starting issues',
        'Alternator noise',
        'Blown fuses'
      ]
    }
  ];

  // Step 2: Questions
  questions: DiagnosticQuestion[] = [
    {
      id: 'q1',
      question: 'When did the problem start?',
      type: 'single',
      options: ['Today', 'This week', 'This month', 'Longer ago']
    },
    {
      id: 'q2',
      question: 'Does the problem occur:',
      type: 'single',
      options: ['All the time', 'Only when cold', 'Only when hot', 'Intermittently']
    },
    {
      id: 'q3',
      question: 'Have you noticed any warning lights?',
      type: 'multiple',
      options: ['Check Engine', 'ABS', 'Battery', 'Oil', 'Temperature', 'None']
    },
    {
      id: 'q4',
      question: 'Any recent maintenance or repairs?',
      type: 'text'
    }
  ];

  // Step 3: Inspection
  inspectionItems = [
    {
      category: 'Fluids',
      items: [
        { id: 'oil', label: 'Engine oil level', checked: false },
        { id: 'coolant', label: 'Coolant level', checked: false },
        { id: 'brake', label: 'Brake fluid level', checked: false },
        { id: 'transmission', label: 'Transmission fluid', checked: false }
      ]
    },
    {
      category: 'Visual',
      items: [
        { id: 'leaks', label: 'Check for leaks under car', checked: false },
        { id: 'belts', label: 'Inspect belts for wear', checked: false },
        { id: 'hoses', label: 'Check hoses for cracks', checked: false },
        { id: 'tires', label: 'Tire condition and pressure', checked: false }
      ]
    },
    {
      category: 'Lights & Indicators',
      items: [
        { id: 'dashboard', label: 'Dashboard warning lights', checked: false },
        { id: 'exterior', label: 'All exterior lights working', checked: false }
      ]
    }
  ];

  // Step 4: Results
  diagnosticResult: DiagnosticResult | null = null;

  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  get currentStepData(): DiagnosticStep {
    return this.steps[this.currentStep - 1];
  }

  get canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.selectedSymptoms.length > 0;
      case 2:
        return this.questions.every(q => q.answer !== undefined && q.answer !== '');
      case 3:
        return this.inspectionItems.some(cat => 
          cat.items.some(item => item.checked)
        );
      case 4:
        return true;
      default:
        return false;
    }
  }

  toggleSymptom(symptom: string): void {
    const index = this.selectedSymptoms.indexOf(symptom);
    if (index > -1) {
      this.selectedSymptoms.splice(index, 1);
    } else {
      this.selectedSymptoms.push(symptom);
    }
  }

  isSymptomSelected(symptom: string): boolean {
    return this.selectedSymptoms.includes(symptom);
  }

  answerQuestion(questionId: string, answer: string | string[]): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.answer = answer;
    }
  }

  toggleMultipleAnswer(questionId: string, option: string): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question && question.type === 'multiple') {
      if (!question.answer) {
        question.answer = [];
      }
      const answers = question.answer as string[];
      const index = answers.indexOf(option);
      if (index > -1) {
        answers.splice(index, 1);
      } else {
        answers.push(option);
      }
    }
  }

  isMultipleAnswerSelected(questionId: string, option: string): boolean {
    const question = this.questions.find(q => q.id === questionId);
    if (question && question.answer && Array.isArray(question.answer)) {
      return question.answer.includes(option);
    }
    return false;
  }

  nextStep(): void {
    if (this.canProceed && this.currentStep < this.totalSteps) {
      this.steps[this.currentStep - 1].completed = true;
      this.currentStep++;
      
      // Generate results when reaching final step
      if (this.currentStep === this.totalSteps) {
        this.generateDiagnosticResult();
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.steps[step - 2]?.completed) {
      this.currentStep = step;
    }
  }

  generateDiagnosticResult(): void {
    // This would normally call the AI agent service
    // For now, generate a mock result based on symptoms
    const hasEngineSymptoms = this.selectedSymptoms.some(s => 
      s.includes('engine') || s.includes('start') || s.includes('power')
    );
    const hasBrakeSymptoms = this.selectedSymptoms.some(s => 
      s.includes('brake') || s.includes('squeaking') || s.includes('grinding')
    );

    if (hasEngineSymptoms) {
      this.diagnosticResult = {
        diagnosis: 'Potential Engine Starting Issue',
        severity: 'high',
        description: 'Based on your symptoms, there may be an issue with the starting system or fuel delivery.',
        possibleCauses: [
          'Weak or dead battery',
          'Faulty starter motor',
          'Fuel pump failure',
          'Ignition system problem',
          'Clogged fuel filter'
        ],
        recommendedActions: [
          'Test battery voltage (should be 12.6V)',
          'Check starter motor operation',
          'Inspect fuel pump pressure',
          'Scan for diagnostic trouble codes',
          'Check spark plugs and ignition coils'
        ],
        estimatedCost: '$150 - $800',
        urgency: 'Address within 1-2 days',
        diyPossible: true,
        diyInstructions: [
          'Test battery with multimeter',
          'Check battery terminals for corrosion',
          'Listen for fuel pump priming when key is turned',
          'Check for spark at spark plugs'
        ]
      };
    } else if (hasBrakeSymptoms) {
      this.diagnosticResult = {
        diagnosis: 'Brake System Maintenance Required',
        severity: 'medium',
        description: 'Your brake system shows signs of wear and requires attention.',
        possibleCauses: [
          'Worn brake pads',
          'Warped brake rotors',
          'Low brake fluid',
          'Contaminated brake fluid',
          'Worn brake hardware'
        ],
        recommendedActions: [
          'Inspect brake pad thickness',
          'Check brake rotor condition',
          'Test brake fluid level and condition',
          'Inspect brake calipers',
          'Road test for proper brake operation'
        ],
        estimatedCost: '$200 - $600',
        urgency: 'Address within 1 week',
        diyPossible: false,
        diyInstructions: []
      };
    } else {
      this.diagnosticResult = {
        diagnosis: 'General Maintenance Check Recommended',
        severity: 'low',
        description: 'Based on your symptoms, a general inspection is recommended.',
        possibleCauses: [
          'Normal wear and tear',
          'Routine maintenance needed',
          'Minor component wear'
        ],
        recommendedActions: [
          'Schedule general inspection',
          'Check all fluid levels',
          'Inspect belts and hoses',
          'Test battery and charging system'
        ],
        estimatedCost: '$100 - $300',
        urgency: 'Schedule at convenience',
        diyPossible: true,
        diyInstructions: [
          'Check all fluid levels',
          'Inspect visible components',
          'Test all lights and accessories'
        ]
      };
    }

    this.steps[this.currentStep - 1].completed = true;
  }

  getSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }

  getSeverityIcon(severity: string): string {
    const icons: Record<string, string> = {
      critical: 'fa-exclamation-circle',
      high: 'fa-exclamation-triangle',
      medium: 'fa-info-circle',
      low: 'fa-check-circle'
    };
    return icons[severity] || 'fa-info-circle';
  }

  findMechanic(): void {
    if (this.diagnosticResult) {
      this.diagnosticAction.emit({
        type: 'find-mechanic',
        result: this.diagnosticResult
      });
    }
  }

  viewDIYGuide(): void {
    if (this.diagnosticResult) {
      this.diagnosticAction.emit({
        type: 'view-diy',
        result: this.diagnosticResult
      });
    }
  }

  completeDiagnostic(): void {
    if (this.diagnosticResult) {
      this.diagnosticAction.emit({
        type: 'complete',
        result: this.diagnosticResult
      });
    }
  }

  cancelDiagnostic(): void {
    this.diagnosticAction.emit({
      type: 'cancel'
    });
  }

  restartDiagnostic(): void {
    this.currentStep = 1;
    this.selectedSymptoms = [];
    this.questions.forEach(q => q.answer = undefined);
    this.inspectionItems.forEach(cat => 
      cat.items.forEach(item => item.checked = false)
    );
    this.diagnosticResult = null;
    this.steps.forEach(s => s.completed = false);
  }
}
