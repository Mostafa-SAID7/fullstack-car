import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentType } from '../../models/ai-agent.models';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  agentMode: AgentType;
  prompt: string;
  color: string;
}

export interface QuickActionEvent {
  action: QuickAction;
  agentMode: AgentType;
  message: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent {
  @Output() actionSelected = new EventEmitter<QuickActionEvent>();

  quickActions: QuickAction[] = [
    {
      id: 'find-car',
      label: 'Find a Car',
      icon: 'fa-shopping-cart',
      description: 'Get personalized car recommendations',
      agentMode: AgentType.BUYER_GUIDE,
      prompt: 'I\'m looking to buy a car. Can you help me find the right one based on my needs?',
      color: '#0d6efd'
    },
    {
      id: 'check-maintenance',
      label: 'Check Maintenance',
      icon: 'fa-wrench',
      description: 'Get maintenance advice and diagnostics',
      agentMode: AgentType.MECHANIC,
      prompt: 'I need help with car maintenance. Can you check what services my car needs?',
      color: '#fd7e14'
    },
    {
      id: 'list-car',
      label: 'List My Car',
      icon: 'fa-tag',
      description: 'Get help selling your car',
      agentMode: AgentType.SELLER_ASSISTANT,
      prompt: 'I want to sell my car. Can you help me create a great listing?',
      color: '#198754'
    },
    {
      id: 'join-groups',
      label: 'Join Groups',
      icon: 'fa-users',
      description: 'Find car enthusiast groups',
      agentMode: AgentType.COMMUNITY_HELPER,
      prompt: 'I\'d like to join car groups and connect with other enthusiasts. What groups do you recommend?',
      color: '#6f42c1'
    },
    {
      id: 'find-events',
      label: 'Find Events',
      icon: 'fa-calendar',
      description: 'Discover nearby car events',
      agentMode: AgentType.COMMUNITY_HELPER,
      prompt: 'What car events are happening near me? I\'d like to attend some meetups or shows.',
      color: '#d63384'
    },
    {
      id: 'modifications',
      label: 'Modify My Car',
      icon: 'fa-cog',
      description: 'Get modification advice',
      agentMode: AgentType.MODIFICATION_EXPERT,
      prompt: 'I want to modify my car. Can you help me understand what modifications are compatible and recommended?',
      color: '#20c997'
    }
  ];

  onActionClick(action: QuickAction): void {
    const event: QuickActionEvent = {
      action,
      agentMode: action.agentMode,
      message: action.prompt
    };
    this.actionSelected.emit(event);
  }

  getActionsByCategory(): { popular: QuickAction[], community: QuickAction[], services: QuickAction[] } {
    return {
      popular: [
        this.quickActions[0], // Find a Car
        this.quickActions[1], // Check Maintenance
        this.quickActions[2]  // List My Car
      ],
      community: [
        this.quickActions[3], // Join Groups
        this.quickActions[4]  // Find Events
      ],
      services: [
        this.quickActions[5]  // Modifications
      ]
    };
  }
}
