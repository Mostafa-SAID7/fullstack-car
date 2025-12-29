import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AiAgentRoutingModule } from './ai-agent-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AiChatComponent } from './components/ai-chat/ai-chat.component';
import { CarRecommendationsComponent } from './components/car-recommendations/car-recommendations.component';
import { MaintenanceAssistantComponent } from './components/maintenance-assistant/maintenance-assistant.component';
import { PriceAnalysisComponent } from './components/price-analysis/price-analysis.component';
import { AiAgentDashboardComponent } from './components/ai-agent-dashboard/ai-agent-dashboard.component';

@NgModule({
  declarations: [
    AiChatComponent,
    CarRecommendationsComponent,
    MaintenanceAssistantComponent,
    PriceAnalysisComponent,
    AiAgentDashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AiAgentRoutingModule,
    SharedModule
  ]
})
export class AiAgentModule { }