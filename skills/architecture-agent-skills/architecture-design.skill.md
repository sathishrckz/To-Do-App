# Architecture Design Skill

**Agent**: architecture-agent  
**Version**: 1.0.0  
**Purpose**: Design high-level system architecture based on requirements

## Capabilities

### 1. Identify Components
- **Function**: `identifyComponents(requirements)`
- **Process**:
  - Extract logical components from requirements
  - Define component responsibilities
  - Document component interfaces
  - Identify component dependencies
- **Output**: Component diagram (Mermaid)

### 2. Recommend Technology Stack
- **Function**: `recommendTechStack(requirements)`
- **Evaluates**:
  - Frontend: HTML5, CSS3, JavaScript/TypeScript, frameworks
  - Backend: Node.js, Java, Python, Go, etc.
  - Database: SQL, NoSQL, cache layers
  - DevOps: Docker, Kubernetes, CI/CD
  - Testing: Jest, Mocha, Pytest, etc.
- **Output**: Technology recommendations with rationale

### 3. Design Data Flow
- **Function**: `designDataFlow(components, requirements)`
- **Creates**:
  - User interaction flows
  - Request/response patterns
  - State management strategy
  - Data persistence approach
- **Output**: Data flow diagram (Mermaid)

### 4. Design API Contracts
- **Function**: `designApiContracts(components)`
- **Defines**:
  - REST endpoints (if applicable)
  - Request/response schemas
  - Error response formats
  - Authentication approach
- **Output**: OpenAPI/Swagger specification

### 5. Design Security Architecture
- **Function**: `designSecurityArchitecture(requirements)`
- **Addresses**:
  - Authentication mechanism
  - Authorization model
  - Input validation strategy
  - XSS prevention measures
  - Data protection measures
- **Output**: Security architecture document

### 6. Design Deployment Architecture
- **Function**: `designDeploymentArchitecture(requirements)`
- **Covers**:
  - Environment strategy (Dev/Staging/Prod)
  - Deployment pipeline
  - Infrastructure as Code
  - Container strategy
- **Output**: Deployment architecture diagram

### 7. Validate Architecture
- **Function**: `validateArchitecture(architecture, requirements)`
- **Checks**:
  - All FR are addressable
  - All NFR constraints satisfied
  - Technology stack is viable
  - Performance targets can be met
  - Security requirements covered
- **Output**: Validation report

## Architecture Documentation Structure
- Executive Summary
- Component Diagram
- Technology Stack Rationale
- Data Flow Architecture
- API Design & Contracts
- Security Architecture
- Scalability & Performance
- Deployment Architecture
- Risk Assessment
- Alternatives Considered

## Success Indicators
✅ All components identified  
✅ Technology stack justified  
✅ Data flows documented  
✅ Security measures defined  
✅ Deployment strategy clear  
✅ Architecture is viable  
