# ReviewForge AI Architecture Guide

```
                       ┌──────────────────────────────────────────┐
                       │          GitHub REST/GraphQL/Webhooks    │
                       └────────────────────┬─────────────────────┘
                                            │
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              Express.js Backend API                                  │
│ ┌───────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Clean Controller  │ │ Application Svc  │ │ Domain & Entities│ │ Repository Layer │ │
│ └───────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ │
└─────────┬──────────────────────┬──────────────────────┬──────────────────────┬───────┘
          │                      │                      │                      │
          ▼                      ▼                      ▼                      ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  MongoDB Atlas    │  │ Redis & BullMQ    │  │ Socket.IO Server  │  │ AI Service Layer  │
│  (Prisma/Mongoose)│  │ (Async Queues)    │  │ (Real-time events)│  │ (OpenAI/Gemini)   │
└───────────────────┘  └───────────────────┘  └───────────────────┘  └───────────────────┘
                                         ▲
                                         │ REST API & WebSockets
                                         │
┌────────────────────────────────────────┴─────────────────────────────────────────────┐
│                              Next.js 15 Frontend App                                 │
│  App Router • Tailwind CSS • Framer Motion • Shadcn UI • Monaco Editor • Recharts     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## System Layers
1. **Presentation Layer**: Next.js 15 App Router (`/client`) rendering responsive dark-mode UI with glassmorphism, Recharts graphs, and Monaco Code Editor.
2. **Controllers & Routes**: Express controllers handling HTTP requests, Zod request validation, and JWT authentication middleware.
3. **Application Services**: Core domain business logic including AIService, ReviewService, SecurityService, and RepoService.
4. **Data Access & Storage**: Mongoose schemas interacting with MongoDB Atlas for persistent storage and Redis for state caching.
5. **Background Queues & Real-time**: BullMQ handling async review processing and Socket.IO pushing live notifications to connected clients.
