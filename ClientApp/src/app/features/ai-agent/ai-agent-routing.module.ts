import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AiAgentDashboardComponent } from './components/ai-agent-dashboard/ai-agent-dashboard.component';
import { AiChatComponent } from './components/ai-chat/ai-chat.component';
import { CarRecommendationsComponent } from './components/car-recommendations/car-recommendations.component';
import { MaintenanceAssistantComponent } from './components/maintenance-assistant/maintenance-assistant.component';
import { PriceAnalysisComponent } from './components/price-analysis/price-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: AiAgentDashboardComponent
  },
  {
    path: 'chat',
    component: AiChatComponent
  },
  {
    path: 'recommendations',
    component: CarRecommendationsComponent
  },
  {
    path: 'maintenance',
    component: MaintenanceAssistantComponent
  },
  {
    path: 'price-analysis',
    component: PriceAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiAgentRoutingModule { }