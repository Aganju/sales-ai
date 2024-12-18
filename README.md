# AI Sales Message Generator

This is a [Next.js](https://nextjs.org) project that uses AI to generate personalized sales messages. It leverages Claude AI for message generation and Redis for job queue management.

## Prerequisites

- Node.js 18+ 
- Redis server running locally or a Redis Cloud instance
- Anthropic API key (for Claude AI)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
ANTHROPIC_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379  # Update if using Redis Cloud
```

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Then, run Redis locally in a separate terminal (if not using Redis Cloud):

```bash
redis-server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open [http://localhost:3000/api/admin/queues](http://localhost:3000/api/admin/queues) to see the BullMQ admin interface.

## Running Tests

The project uses Vitest for testing. To run the test suite:

```bash
npm run test
```

## Project Structure

- `/app` - Next.js 13+ app directory containing routes and components
- `/components` - Reusable UI components
- `/lib` - Core business logic, services and utilities
- `/__tests__` - Test files
- `/types` - TypeScript type definitions

## Key Features

- AI-powered sales message generation
- Multiple tone options (professional, consultative, dynamic, friendly)
- Rate limiting for API calls
- Job queue for handling message generation
- Message history management
- Real-time status updates

## Key Architecture Decisions

### Storage Strategy

The system implements a hybrid storage approach:

Client-Side: Local storage for message history (50-entry limit)
Server-Side: Redis for job status and generated content

Enables efficient queue processing
Provides temporary persistence for job results
Maintains system state during processing

### Monitoring Interface

Selected Hono over Express for Bull Board integration due to:

- Edge compatibility
- Lightweight footprint
- Scalability in client-storage focused environments
- Reduced server overhead

### AI Provider Design

Implemented with provider interchangeability in mind:

- Abstract interface allowing multiple AI provider implementations
- Standardized response format across providers
- Configuration-based provider selection

Benefits:

Service redundancy during outages
Future flexibility for client choice of preferred AI model

### Scalability Considerations

#### Queue Processing

- Configurable concurrency settings
- Rate limiting per provider
- Automatic job retries

#### Client-Side Performance

- Entry limit on local storage
- Efficient state management

#### Monitoring and Maintenance

- Bull Board interface for queue monitoring
- Job status tracking
- Error logging and monitoring

### Future Considerations

- Database integration for long-term storage if needed
- Additional AI provider integrations
- Enhanced monitoring and analytics
