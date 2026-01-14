# AI Agent Enhancement - Project Structure

## Overview

This document provides a clear, non-duplicated view of the AI Agent Enhancement project structure across all three specification documents.

## Document Responsibilities

### 1. Requirements Document (`.kiro/specs/ai-agent-enhancement/requirements.md`)
**Purpose**: WHAT we need to build

**Contains**:
- 15 functional requirements with user stories
- Acceptance criteria for each requirement
- Success metrics and KPIs
- Business goals and vision

**Does NOT contain**:
- Implementation details
- Code structure
- Task breakdowns

---

### 2. Design Document (`.kiro/specs/ai-agent-enhancement/design.md`)
**Purpose**: HOW we will build it

**Contains**:
- System architecture diagrams
- Component designs (Python Backend, Dashboard, Main App)
- Data models and schemas
- API specifications (endpoints, request/response formats)
- Database schema (tables, indexes, relationships)
- Error handling strategies
- Testing strategy overview
- Technology choices and rationale

**Does NOT contain**:
- Requirements (those are in requirements.md)
- Step-by-step implementation tasks
- Task dependencies

---

### 3. Tasks Document (`.kiro/specs/ai-agent-enhancement/tasks.md`)
**Purpose**: WHEN and in WHAT ORDER we build it

**Contains**:
- 50 implementation tasks organized in 4 phases
- Task dependencies and order
- Subtasks and acceptance criteria per task
- Files to create/modify per task
- Progress tracking checklist
- Dependency graph

**Does NOT contain**:
- Detailed code examples (those are in design.md)
- Requirements rationale (those are in requirements.md)
- Architecture decisions

---

## Project Structure (No Duplications)

### Existing Structure (Already Built)
```
ai-agent/
├── main.py                          # FastAPI app with existing routes
├── requirements.txt                 # Current dependencies
├── .env                            # Environment configuration
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── config.py               # Settings and configuration
│   │   ├── database.py             # SQLite database setup
│   │   └── ai_service.py           # Current AI service (to be refactored)
│   ├── models/
│   │   ├── db_models.py            # Database models
│   │   └── schemas.py              # Pydantic DTOs (to be extended)
│   ├── api/
│   │   └── routes/
│   │       ├── chat.py             # Chat endpoint (to be enhanced)
│   │       ├── recommendations.py  # Recommendations endpoint
│   │       ├── maintenance.py      # Maintenance endpoint
│   │       ├── analysis.py         # Analysis endpoint
│   │       └── training.py         # Training endpoint
│   └── services/
│       ├── inventory_service.py    # Inventory search (to be enhanced)
│       ├── scraper_service.py      # News scraping
│       └── car_image_service.py    # Image handling
```

### New Structure (To Be Created)
```
ai-agent/
├── app/
│   ├── core/
│   │   ├── cache.py                # NEW: Redis caching
│   │   └── exceptions.py           # NEW: Custom exceptions
│   ├── models/
│   │   └── schemas.py              # EXTEND: Add conversation, agent, knowledge models
│   ├── agents/                     # NEW: Specialized agents
│   │   ├── __init__.py
│   │   ├── base_agent.py           # Base agent class
│   │   ├── mechanic_agent.py       # Maintenance expert
│   │   ├── buyer_guide_agent.py    # Buying assistant
│   │   ├── seller_assistant_agent.py # Selling helper
│   │   ├── modification_expert_agent.py # Modification advisor
│   │   ├── community_helper_agent.py # Platform guide
│   │   └── general_agent.py        # Default agent
│   ├── repositories/               # NEW: Database repositories
│   │   ├── __init__.py
│   │   ├── base_repository.py
│   │   ├── conversation_repository.py
│   │   ├── feedback_repository.py
│   │   ├── analytics_repository.py
│   │   └── knowledge_repository.py
│   ├── services/
│   │   ├── llm_client.py           # NEW: LLM wrapper with retry
│   │   ├── prompt_templates.py     # NEW: Prompt templates
│   │   ├── knowledge_base.py       # NEW: Vector knowledge base
│   │   ├── embedding_service.py    # NEW: Embedding generation
│   │   ├── intent_classifier.py    # NEW: Intent detection
│   │   ├── agent_router.py         # NEW: Agent routing
│   │   ├── conversation_manager.py # NEW: Conversation state
│   │   ├── learning_system.py      # NEW: Continuous learning
│   │   ├── community_service.py    # NEW: Community integration
│   │   └── document_parser.py      # NEW: Document parsing
│   └── api/
│       └── routes/
│           ├── conversations.py    # NEW: Conversation management
│           ├── agents.py           # NEW: Agent management
│           ├── knowledge.py        # NEW: Knowledge base
│           ├── feedback.py         # NEW: Feedback endpoints
│           └── analytics.py        # NEW: Analytics endpoints
└── tests/                          # NEW: Test suite
    ├── test_agent_router.py
    ├── test_intent_classifier.py
    ├── test_knowledge_base.py
    ├── test_conversation_manager.py
    ├── test_llm_client.py
    ├── test_learning_system.py
    └── integration/
        ├── test_chat_api.py
        ├── test_agent_api.py
        └── test_knowledge_api.py
```

### Frontend Structure (To Be Created)

#### Dashboard (React)
```
ClientApp/Dashboard/src/features/ai-agent/
├── index.ts
├── types/index.ts                  # TypeScript interfaces
├── services/
│   └── ai-agent.service.ts         # API client
├── routes.tsx                      # Route configuration
├── pages/
│   ├── Overview.tsx                # Agent status dashboard
│   ├── Configuration.tsx           # Agent configuration
│   ├── KnowledgeBase.tsx          # Knowledge management
│   ├── ConversationMonitor.tsx    # Live monitoring
│   ├── Training.tsx               # Training interface
│   ├── Analytics.tsx              # Analytics dashboard
│   ├── FeedbackReview.tsx         # Feedback review
│   ├── Testing.tsx                # Agent testing
│   └── Settings.tsx               # Global settings
└── components/
    ├── MetricCard.tsx
    ├── AgentConfigForm.tsx
    ├── KnowledgeEntryList.tsx
    ├── KnowledgeEntryForm.tsx
    ├── FileUpload.tsx
    ├── ConversationCard.tsx
    ├── ConversationDetail.tsx
    ├── TrainingSessionList.tsx
    ├── TrainingProgress.tsx
    ├── ConversationChart.tsx
    ├── AgentPerformanceChart.tsx
    ├── TopicAnalysis.tsx
    ├── FeedbackList.tsx
    ├── FeedbackDetail.tsx
    ├── TestMessageForm.tsx
    ├── ResponsePreview.tsx
    └── SettingsForm.tsx
```

#### Main App (Angular)
```
ClientApp/Main/src/app/features/ai-agent/
├── services/
│   └── ai-agent.service.ts         # ENHANCE: Add new methods
├── components/
│   ├── ai-chat-widget/             # ENHANCE: Add markdown, images
│   │   ├── ai-chat-widget.component.ts
│   │   ├── ai-chat-widget.component.html
│   │   └── ai-chat-widget.component.scss
│   ├── agent-mode-selector/        # NEW: Agent mode switcher
│   ├── conversation-history/       # NEW: History viewer
│   ├── quick-actions/              # NEW: Quick action buttons
│   ├── feedback-buttons/           # NEW: Thumbs up/down
│   ├── feedback-form/              # NEW: Correction form
│   ├── recommendation-card/        # NEW: Car recommendations
│   ├── recommendation-comparison/  # NEW: Compare cars
│   ├── maintenance-schedule/       # NEW: Maintenance timeline
│   └── diagnostic-wizard/          # NEW: Diagnostic helper
└── assets/i18n/ai-agent/           # NEW: Translations
    ├── en-US.json
    ├── ar-EG.json
    ├── ar-AE.json
    └── ar-SA.json
```

---

## Key Architectural Decisions

### 1. Multi-Agent System
- **Decision**: Use specialized agents instead of one monolithic AI
- **Rationale**: Better expertise, easier to maintain, clearer routing
- **Implementation**: BaseAgent + 6 specialized agents + AgentRouter

### 2. Vector Knowledge Base
- **Decision**: Use ChromaDB for semantic search
- **Rationale**: Fast similarity search, easy to update, supports embeddings
- **Implementation**: KnowledgeBase service + SentenceTransformer embeddings

### 3. Conversation State Management
- **Decision**: Separate ConversationManager from AIService
- **Rationale**: Single responsibility, easier testing, better caching
- **Implementation**: ConversationManager + Redis cache + SQLite persistence

### 4. Continuous Learning
- **Decision**: Learn from user feedback and corrections
- **Rationale**: Improve over time, fill knowledge gaps, user-driven improvement
- **Implementation**: LearningSystem + Feedback collection + Knowledge base updates

### 5. Community Integration
- **Decision**: Deep integration with platform features
- **Rationale**: Context-aware responses, actionable recommendations, seamless UX
- **Implementation**: CommunityService + InventoryService + Backend API calls

---

## Implementation Order (No Duplications)

### Phase 1: Python Backend Foundation (Weeks 1-3)
1. Enhance infrastructure (dependencies, database, cache)
2. Extend data models
3. Create repositories
4. Build knowledge base engine
5. Enhance LLM client
6. Create base agent class
7. Implement specialized agents
8. Build intent classifier
9. Create agent router
10. Refactor conversation manager
11. Build learning system
12. Enhance community integration
13. Enhance chat API
14. Create agent management API
15. Create knowledge base API

### Phase 2: Dashboard Implementation (Weeks 4-5)
16-25. Build React components for agent management

### Phase 3: Main App Enhancement (Weeks 6-7)
26-35. Enhance Angular chat widget and add new features

### Phase 4: Testing & Deployment (Weeks 8-10)
36-50. Tests, optimization, documentation, deployment

---

## Success Criteria

### Technical
- ✅ All 50 tasks completed
- ✅ All tests passing (unit, integration, E2E)
- ✅ Response time < 2 seconds (95th percentile)
- ✅ Cache hit rate > 60%
- ✅ Intent classification accuracy > 90%

### Business
- ✅ User satisfaction > 4.5/5.0
- ✅ Conversation completion rate > 85%
- ✅ Support ticket reduction > 30%
- ✅ User engagement increase > 40%

---

## Next Steps

1. **Review this structure** - Ensure no duplications or missing pieces
2. **Start with Task 1** - Enhance backend infrastructure
3. **Follow task order** - Respect dependencies
4. **Test incrementally** - Don't wait until the end
5. **Document as you go** - Update docs with learnings

---

*Last Updated: January 14, 2026*
