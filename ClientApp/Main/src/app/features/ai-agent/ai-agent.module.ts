import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components (to be created)
// import { AIAgentChatComponent } from './components/ai-agent-chat/ai-agent-chat.component';
import { AIChatWidgetComponent } from './components/ai-chat-widget/ai-chat-widget.component';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AIChatWidgetComponent
    ],
    exports: [
        AIChatWidgetComponent
    ],
    providers: []
})
export class AIAgentModule { }
