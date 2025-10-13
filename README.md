# CV Analyzer

A full-stack application that matches candidate CVs (PDF or TXT) to job vacancy descriptions using LLM-powered summaries and ratings.

## Application Overview

- **Backend**: Spring Boot REST API with OpenAI integration
- **Frontend**: React web application with modern UI
- **Features**: CV analysis, candidate matching, and rating system

## Features

### Backend Features
- Upload CVs as `.pdf` or `.txt` files to `backend/src/main/resources/cvs/`
- REST API to find the best-matching candidates for a job description
- Uses OpenAI (or compatible) LLM to generate fit summaries and ratings
- Externalized prompt templates with System/User roles for robust, tunable inference
- **Simplified error handling with user-friendly messages**
- **Proper AI service error classification (rate limits, authentication, etc.)**
- **Clean validation error messages without technical details**
- **GenAI metrics exposed via Spring Boot Actuator endpoints for LLM usage monitoring**
- **Real-time cost tracking with actual token usage via Aspect-Oriented Programming (AOP)**
- **Configurable OpenAI pricing with automatic cost calculation**
- **Health monitoring and system metrics via Spring Boot Actuator**
- **Admin-only prompt management with secure REST API endpoints**

### Frontend Features
- **Modern React web interface with Chakra UI components**
- **Responsive sidebar navigation with collapsible menu**
- **Dark/Light theme toggle with persistent user preference**
- Upload and manage CV files
- Submit job descriptions for candidate matching
- **Visual candidate ratings with circular progress gauges**
- **Candidate sorting from best match to worst**
- **Enhanced error handling with user-friendly messages**
- **Real-time Health & Metrics dashboard with auto-refresh**
- **GenAI cost tracking and token usage visualization**
- **System health monitoring with detailed component status**
- **Drag & Drop Health Cards**: Customizable metric card layout with persistent user preferences
- **Admin Panel with tabbed interface for system and prompt management**
- **Secure prompt management with view, edit, reset, and refresh capabilities**
- Responsive design for desktop, tablet, and mobile

## Prerequisites

### Option 1: Local Development
- Java 17+
- Maven 3.8+
- Node.js 18+ (for frontend)
- An OpenAI API key (or compatible endpoint)

### Option 2: Docker (Recommended)
- Docker
- Docker Compose
- An OpenAI API key (or compatible endpoint)

## Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd cv-analyzer
```

2. **Add your OpenAI API key**

Create a `.env` file in the project root:

```
OPENAI_API_KEY=sk-...your-key...
```

**Optional: Configure OpenAI pricing (defaults to GPT-4o pricing)**
```
OPENAI_PRICING_INPUT=0.1
OPENAI_PRICING_OUTPUT=0.4
OPENAI_PRICING_CURRENCY=USD
```

3. **Add candidate CVs**

Place `.pdf` and/or `.txt` files in:

```
backend/src/main/resources/cvs/
```

Each file should represent one candidate's resume.

## Running the Application

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Start all services
docker-compose up -d

# Or use the management script
./docker-scripts.sh start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health & Metrics Dashboard**: http://localhost:3000/health
- **Admin Panel**: http://localhost:3000/admin

**Other useful Docker commands:**
```bash
# Check service status
./docker-scripts.sh status

# View logs
./docker-scripts.sh logs

# Stop services
./docker-scripts.sh stop

# Development mode with hot reloading
./docker-scripts.sh dev
```

#### Selecting an AI profile (OpenAI vs Groq vs Docker LLM)

The backend supports multiple Spring profiles to switch AI providers:

- `main` (default) – OpenAI-compatible settings from `application.properties`
- `groq` – Uses `application-groq.properties` (Groq's OpenAI-compatible endpoint)
- `docker-llm` – Uses `application-docker-llm.properties` (local OpenAI-compatible endpoint at `http://localhost:12434/engines`, model `ai/gemma3`, dummy API key)
- `dev` – Development profile used by `docker-compose.dev.yml`

Use any of the following methods to select a profile:

1) With the management script:

```bash
# OpenAI (default)
./docker-scripts.sh start

# Explicit OpenAI
./docker-scripts.sh start main

# Groq profile
./docker-scripts.sh start groq

# Local Docker LLM profile
./docker-scripts.sh start docker-llm

# Development with Groq
./docker-scripts.sh dev groq

# Development with local Docker LLM
./docker-scripts.sh dev docker-llm
```

2) With Docker Compose directly:

```bash
# Production stack with Groq
SPRING_PROFILES_ACTIVE=groq docker-compose up -d

# Production stack with local Docker LLM
SPRING_PROFILES_ACTIVE=docker-llm docker-compose up -d

# Development stack with Groq (overrides default dev)
SPRING_PROFILES_ACTIVE=groq docker-compose -f docker-compose.dev.yml up --build

# Development stack with local Docker LLM (overrides default dev)
SPRING_PROFILES_ACTIVE=docker-llm docker-compose -f docker-compose.dev.yml up --build
```

3) Running locally (without Docker):

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=groq

# Locally with Docker LLM
./mvnw spring-boot:run -Dspring-boot.run.profiles=docker-llm
```

Notes:
- Set `OPENAI_API_KEY` to your Groq API key when using the `groq` profile.
- Groq profile uses base URL `https://api.groq.com/openai` and model `gemma2-9b-it` by default.
- Docker LLM profile uses base URL `http://localhost:12434/engines`, model `ai/gemma3`, and a dummy API key. Ensure your local LLM is running and exposing an OpenAI-compatible API.

### Option 2: Local Development

If you prefer to run the services locally:

**Backend:**
```bash
cd backend
./mvnw clean package
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

The backend will start on [http://localhost:8080](http://localhost:8080) and the frontend on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
cv-analyzer/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   │   ├── aspect/         # AOP aspects for cross-cutting concerns
│   │   ├── config/         # Spring configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── exception/     # Custom exception classes
│   │   ├── model/         # Domain models and internal data structures
│   │   └── service/       # Business logic services
│   ├── src/main/resources/ # Configuration and resources
│   │   ├── cvs/           # CV files directory
│   │   ├── prompts/       # AI prompt templates
│   │   └── application.properties # Application configuration
│   └── Dockerfile         # Backend Docker configuration
├── frontend/               # React application
│   ├── src/               # React source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main application component
│   ├── public/            # Static assets
│   └── Dockerfile         # Frontend Docker configuration
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── docker-scripts.sh      # Docker management script
└── .env                   # Environment variables
```

## API Usage

### Match Candidates Endpoint

**POST** `/api/candidate-matcher/match`

**Request Body:**

```json
{
  "vacancyDescription": "Looking for a Java developer with Spring Boot and PDF processing experience."
}
```

**Response:**

```json
[
  {
    "name": "John Doe",
    "filename": "john_doe.pdf",
    "summary": "John has extensive experience in Java and Spring Boot, as well as hands-on PDF processing. This makes him an excellent fit for the role described.",
    "rating": 85,
    "minRating": 1,
    "maxRating": 100
  },
  ...
]
```

### Example cURL

```bash
curl -X POST http://localhost:8080/api/candidate-matcher/match \
  -H "Content-Type: application/json" \
  -d '{"vacancyDescription": "Looking for a Java developer with Spring Boot and PDF processing experience."}'
```

### Error Handling Examples

The API now provides clean, user-friendly error messages:

**Validation Error (Short Description):**
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Vacancy description must be between 10 and 10000 characters"
}
```

**Rate Limit Error:**
```json
{
  "status": 429,
  "error": "Too Many Requests",
  "message": "AI service rate limit exceeded. Please try again later."
}
```

**Authentication Error:**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid API key. Please check your configuration."
}
```

### Cost Metrics Endpoint

**GET** `/api/cost/metrics`

**Response:**
```json
{
  "totalCost": 0.0045,
  "totalInputTokens": 1360,
  "totalOutputTokens": 114,
  "pricing": {
    "inputTokensPerMillion": 0.1,
    "outputTokensPerMillion": 0.4,
    "currency": "USD"
  }
}
```

### Pricing Information Endpoint

**GET** `/api/cost/pricing`

**Response:**
```json
{
  "inputTokensPerMillion": 0.1,
  "outputTokensPerMillion": 0.4,
  "currency": "USD"
}
```

### Prompt Management API (Admin Only)

**All prompt management endpoints require admin authentication.**

#### Get All Prompts

**GET** `/api/admin/prompts`

**Authentication:** Basic Auth (admin:admin)

**Response:**
```json
[
  {
    "type": "summary",
    "role": "system",
    "content": "You are an expert technical recruiter...",
    "filePath": "classpath:prompts/summary/system.txt",
    "cached": true
  },
  ...
]
```

#### Get Specific Prompt

**GET** `/api/admin/prompts/{type}/{role}`

**Authentication:** Basic Auth (admin:admin)

**Example:**
```bash
curl -u admin:admin http://localhost:8080/api/admin/prompts/summary/system
```

#### Update Prompt

**PUT** `/api/admin/prompts`

**Authentication:** Basic Auth (admin:admin)

**Request Body:**
```json
{
  "type": "summary",
  "role": "system",
  "content": "Updated prompt content..."
}
```

#### Reset Prompt to Default

**POST** `/api/admin/prompts/{type}/{role}/reset`

**Authentication:** Basic Auth (admin:admin)

**Example:**
```bash
curl -u admin:admin -X POST http://localhost:8080/api/admin/prompts/summary/system/reset
```

#### Refresh All Prompts

**POST** `/api/admin/prompts/refresh`

**Authentication:** Basic Auth (admin:admin)

**Example:**
```bash
curl -u admin:admin -X POST http://localhost:8080/api/admin/prompts/refresh
```

### GenAI Metrics via Actuator

Spring Boot Actuator exposes health, info, and metrics endpoints.  
GenAI metrics are available at:

- `/actuator/health` - System health status
- `/actuator/metrics/gen_ai.client.operation` - Total LLM operations
- `/actuator/metrics/gen_ai.client.operation.active` - Active operations
- `/actuator/metrics/gen_ai.client.token.usage` - Token usage statistics
- `/api/cost/metrics` - **Real-time cost tracking with actual token usage**
- `/api/cost/pricing` - **Current pricing configuration**

These endpoints provide insights into LLM usage, performance, and costs.

### Health & Metrics Dashboard

The application includes a comprehensive **Health & Metrics Dashboard** accessible at `/health` that provides:

- **System Health Status**: Real-time backend health monitoring
- **GenAI Operations**: Total LLM API calls made
- **Token Usage**: Input/output token consumption with detailed breakdown
- **Cost Tracking**: Real-time cost calculation based on actual token usage
- **Pricing Information**: Current OpenAI pricing configuration
- **Auto-refresh**: Updates every 30 seconds automatically
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Drag & Drop Cards**: Customizable metric card layout with persistent user preferences
- **Visual Drag Handles**: Intuitive drag indicators for easy reordering
- **Touch Support**: Full mobile and tablet drag and drop support

### Cost Tracking Features

The application now includes **comprehensive cost tracking**:

- **Real-time Token Usage**: Tracks actual input/output tokens from OpenAI API responses
- **Automatic Cost Calculation**: Uses configurable pricing to calculate costs
- **AOP-based Tracking**: Uses Aspect-Oriented Programming for clean separation of concerns
- **Micrometer Integration**: Exposes cost metrics via Spring Boot Actuator
- **Configurable Pricing**: Set custom pricing via environment variables
- **Historical Tracking**: Maintains cumulative cost and token usage

## Prompt Management

### Admin Interface

The application provides a comprehensive **Admin Panel** for managing AI prompts through a secure web interface:

- **Access**: Navigate to `/admin` and switch to the "Prompt Management" tab
- **Authentication**: Requires admin credentials (default: admin:admin)
- **Features**:
  - **View Prompts**: See all current prompts with content preview
  - **Edit Prompts**: Modify prompt content with a rich text editor
  - **Reset Prompts**: Restore prompts to their default values
  - **Refresh Cache**: Reload prompts from files without restart
  - **Copy to Clipboard**: Easy content copying for external editing

### Prompt Structure

- Prompts are externalized to files under `src/main/resources/prompts`:
  - Summary system: `prompts/summary/system.txt`
  - Summary user: `prompts/summary/user.txt`
  - Rating system: `prompts/rating/system.txt`
  - Rating user: `prompts/rating/user.txt`
- Placeholders available in user templates:
  - `{{vacancy_description}}`
  - `{{cv_content}}`
- The app sends role-based messages to the LLM: a System instruction plus a User message rendered from the templates with your placeholders.

### Configuration Options

You can override prompt file locations without changing code:
- In `application.properties`:
  - `prompts.summary.system=classpath:prompts/summary/system.txt`
  - `prompts.summary.user=classpath:prompts/summary/user.txt`
  - `prompts.rating.system=classpath:prompts/rating/system.txt`
  - `prompts.rating.user=classpath:prompts/rating/user.txt`
- Or via environment variables (Spring property syntax):
  - `PROMPTS_SUMMARY_SYSTEM=file:/abs/path/summary-system.txt`
  - `PROMPTS_SUMMARY_USER=file:/abs/path/summary-user.txt`
  - `PROMPTS_RATING_SYSTEM=file:/abs/path/rating-system.txt`
  - `PROMPTS_RATING_USER=file:/abs/path/rating-user.txt`

### Runtime Management

- **File Persistence**: Changes made through the admin interface are saved to actual files
- **Cache Synchronization**: Memory cache stays in sync with file changes
- **No Restart Required**: All prompt changes take effect immediately
- **Backup & Recovery**: Reset functionality restores original prompt values

### Security

- **Admin-Only Access**: All prompt management requires admin authentication
- **HTTP Basic Auth**: Default credentials (override in production):
  - Username: `admin` (property `admin.username` or env `ADMIN_USERNAME`)
  - Password: `admin` (property `admin.password` or env `ADMIN_PASSWORD`)
- **API Protection**: All `/api/admin/prompts/**` endpoints are secured with `@PreAuthorize("hasRole('ADMIN')")`

### Example: Custom Admin Credentials

```bash
export ADMIN_USERNAME=myadmin
export ADMIN_PASSWORD=strongsecret
# then restart the app and use
curl -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" -X POST http://localhost:8080/api/admin/prompts/refresh
```

## User Interface Features

### Navigation & Theming
- **Collapsible Sidebar**: Responsive navigation menu that adapts to screen size
- **Dark/Light Theme**: Toggle between themes with persistent user preference
- **Mobile-First Design**: Optimized for mobile, tablet, and desktop viewing
- **Chakra UI Components**: Modern, accessible UI components throughout

### Pages & Functionality
- **Candidate Search** (`/`): Main page for job description input and candidate matching
  - **Visual Rating Display**: Circular progress gauges showing candidate ratings (1-100)
  - **Candidate Sorting**: Sort candidates by rating (best to worst), name, or filename
  - **Enhanced Error Handling**: User-friendly error messages with clear actions
  - **Input Validation**: Real-time validation with helpful error messages
- **Admin Panel** (`/admin`): Comprehensive admin interface with tabbed sections:
  - **System Management**: General admin operations and prompt refresh
  - **Prompt Management**: View, edit, reset, and refresh AI prompts (admin-only)
- **Health & Metrics** (`/health`): Real-time system monitoring and cost tracking with:
  - **Drag & Drop Interface**: Reorder metric cards by dragging
  - **Persistent Layout**: Custom card order saved across sessions
  - **Visual Feedback**: Drag handles and smooth animations
  - **Touch Support**: Mobile-friendly drag and drop gestures

## Recent Improvements

### Enhanced User Experience
- **Visual Rating System**: Replaced text-based ratings with interactive circular progress gauges
- **Candidate Sorting**: Added sorting options to organize candidates by rating, name, or filename
- **Improved Error Handling**: Simplified error messages that are user-friendly and actionable
- **Input Validation**: Real-time validation with clear, non-technical error messages

### Backend Error Handling
- **Simplified Error Responses**: Clean, minimal error structure without technical details
- **Proper Error Classification**: AI service errors are correctly categorized (rate limits, authentication, etc.)
- **User-Friendly Messages**: Validation errors show only relevant information to users
- **Consistent Error Format**: Standardized error response structure across all endpoints

### Code Quality & Maintenance
- **Removed Unused Components**: Cleaned up test files and unused code
- **Simplified Architecture**: Reduced complexity in error handling and UI components
- **Better Performance**: Optimized bundle size and reduced technical debt
- **Cleaner Codebase**: Removed retry logic and complex error categorization

## Technical Architecture

### Backend Architecture
- **Spring Boot**: REST API with embedded Tomcat server
- **Aspect-Oriented Programming (AOP)**: Clean separation of cross-cutting concerns like cost tracking
- **Micrometer**: Metrics collection and exposure via Spring Boot Actuator
- **OpenAI Integration**: Direct API integration with token usage tracking
- **Exception Handling**: Custom exceptions with proper error propagation
- **Clean Code Principles**: Following Uncle Bob's Clean Code guidelines with small functions, meaningful names, and DRY principles
- **Admin Security**: Spring Security with role-based access control for admin functions
- **File Management**: Dynamic prompt file reading and writing with cache synchronization

### Frontend Architecture
- **React 18**: Modern React with hooks and functional components
- **Chakra UI**: Component library with built-in theming and accessibility
- **React Router**: Client-side routing with nested routes
- **Axios**: HTTP client for API communication
- **@dnd-kit**: Modern drag and drop library with touch and keyboard support
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Drag & Drop Health Dashboard

The Health & Metrics page features an advanced **drag and drop interface** that allows users to customize their dashboard layout:

### Features
- **11 Draggable Cards**: All metric cards can be reordered to match user preferences
- **Visual Drag Handles**: Intuitive drag indicators (⋮⋮) on each card
- **Smooth Animations**: CSS transitions provide fluid reordering experience
- **Persistent Storage**: Card order is automatically saved to localStorage
- **Cross-Session Memory**: Custom layout persists between browser sessions
- **Touch Support**: Full mobile and tablet drag and drop functionality
- **Keyboard Navigation**: Accessible drag and drop with keyboard controls

### Available Cards
1. **System Health**: Backend status and component health
2. **GenAI Operations**: Total LLM API calls made
3. **Token Usage**: Input/output token consumption
4. **API Costs**: Real-time cost calculation
5. **Input Tokens**: Prompt token usage
6. **Output Tokens**: Response token usage
7. **Operation Details**: GenAI operation metadata
8. **Token Details**: Token usage metadata
9. **Pricing Information**: Current OpenAI pricing
10. **Latest AI Call**: Most recent API call details
11. **Health Details**: Component-by-component health status

### How to Use
1. Navigate to the Health page (`/health`)
2. Look for the drag handle (⋮⋮) in the top-right of each card
3. Click and drag any card to reorder them
4. Release to drop the card in its new position
5. Your custom order will be automatically saved and restored on future visits

## Notes

- The OpenAI API key is required for LLM-powered summaries and ratings.
- The app supports both `.pdf` and `.txt` CVs.
- Summaries and ratings are generated per candidate using the LLM.
- **Visual ratings** are displayed as circular progress gauges (1-100 scale).
- **Candidate sorting** allows organizing results by rating, name, or filename.
- **Error handling** provides user-friendly messages without technical details.
- **Cost tracking is automatic** and based on actual token usage from OpenAI API responses.
- **All metrics are exposed** via Spring Boot Actuator for monitoring and alerting.
- **Pricing is configurable** via environment variables for different OpenAI models.
- **Prompt management is admin-only** and requires authentication for security.
- **All prompt changes are persistent** and saved to files for durability.
- **Admin credentials should be changed** in production environments.
- **Health dashboard layout is customizable** with drag and drop functionality.
- **User preferences are automatically saved** to localStorage for persistence.
- **Input validation** provides real-time feedback with clear error messages.
- **AI service errors** are properly classified (rate limits, authentication, etc.).

## License

MIT
