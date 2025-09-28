# Personal Development Journey Project Plan (Final Version)

## Project Overview

Hệ thống thu thập thông tin phát triển bản thân qua form ẩn danh, tự động tạo timeline phát triển từ AI và hiển thị kết quả cho người dùng. Sử dụng schema database đã được xác nhận với 3 bảng chính.

## Confirmed Database Schema

### 1. Form Submissions Table

```sql
DROP TABLE IF EXISTS form_submissions;

CREATE TABLE form_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(45) NOT NULL, -- IPv4/IPv6
    user_agent TEXT, -- Browser fingerprint
    data JSON NOT NULL, -- Complete form data in JSON format
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Basic extracted fields for easy querying
    age INT NOT NULL DEFAULT 0,
    occupation VARCHAR(255), -- Nghề Nghiệp Hiện Tại
    education_level VARCHAR(255), -- Trình Độ Học Vấn

    -- Processing status tracking
    ai_processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    error_message TEXT NULL, -- Store AI API errors

    -- Rate limiting support
    daily_submission_count INT DEFAULT 1, -- Track submissions per day for this IP

    INDEX idx_ip_address (ip_address),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_ai_status (ai_processing_status),
    INDEX idx_daily_count (ip_address, submitted_at) -- For rate limiting
);
```

### 2. Timelines Table

```sql
DROP TABLE IF EXISTS timelines;

CREATE TABLE timelines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    form_submission_id BIGINT NOT NULL, -- References form_submissions.id
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content JSON NOT NULL, -- Timeline structure (phases, milestones, tasks)
    ai_response JSON, -- Raw response from AI API
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public TINYINT DEFAULT 0, -- Can be shown as example (0=false, 1=true)
    view_count INT DEFAULT 0 -- How many times this timeline was viewed
);
```

### 3. Admin Users Table

```sql
DROP TABLE IF EXISTS admin_users;

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,

    INDEX idx_username (username)
);
```

## TypeORM Entities

### FormSubmissionEntity

```typescript
// src/database/entities/form-submission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimelineEntity } from './timeline.entity';

@Entity('form_submissions')
export class FormSubmissionEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column({ type: 'varchar', length: 45 })
	ip_address: string;

	@Column({ type: 'text', nullable: true })
	user_agent: string;

	@Column({ type: 'json' })
	data: any; // Complete form data as JSON

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	submitted_at: Date;

	@Column({ type: 'int', default: 0 })
	age: number;

	@Column({ type: 'varchar', length: 255, nullable: true })
	occupation: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	education_level: string;

	@Column({
		type: 'enum',
		enum: ['pending', 'processing', 'completed', 'failed'],
		default: 'pending',
	})
	ai_processing_status: string;

	@Column({ type: 'text', nullable: true })
	error_message: string;

	@Column({ type: 'int', default: 1 })
	daily_submission_count: number;

	// Relationship
	@OneToMany(() => TimelineEntity, (timeline) => timeline.formSubmission)
	timelines: TimelineEntity[];
}
```

### TimelineEntity

```typescript
// src/database/entities/timeline.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FormSubmissionEntity } from './form-submission.entity';

@Entity('timelines')
export class TimelineEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column({ type: 'bigint' })
	form_submission_id: number;

	@Column({ type: 'varchar', length: 255 })
	title: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@Column({ type: 'json' })
	content: any; // Timeline structure

	@Column({ type: 'json', nullable: true })
	ai_response: any; // Raw AI response

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	generated_at: Date;

	@Column({ type: 'tinyint', default: 0 })
	is_public: number; // 0 = false, 1 = true

	@Column({ type: 'int', default: 0 })
	view_count: number;

	// Relationship
	@ManyToOne(() => FormSubmissionEntity, (submission) => submission.timelines)
	@JoinColumn({ name: 'form_submission_id' })
	formSubmission: FormSubmissionEntity;
}
```

### AdminUserEntity

```typescript
// src/database/entities/admin-user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admin_users')
export class AdminUserEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'varchar', length: 50, unique: true })
	username: string;

	@Column({ type: 'varchar', length: 255 })
	password_hash: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date;

	@Column({ type: 'timestamp', nullable: true })
	last_login_at: Date;
}
```

## JSON Data Structures

### Form Data Structure

```typescript
interface FormSubmissionData {
	personalInfo: {
		fullName?: string;
		age: number; // Also stored in age column
		occupation: string; // Also stored in occupation column
		educationLevel: string; // Also stored in education_level column
		location?: string;
		workExperience?: number; // years
	};
	currentSituation: {
		currentSkills: string[];
		strengths: string;
		weaknesses: string;
		currentChallenges: string;
		jobSatisfaction?: number; // 1-10 scale
	};
	goals: {
		shortTermGoals: string; // 6 months
		mediumTermGoals: string; // 1-2 years
		longTermGoals: string; // 3-5 years
		careerAspirations: string;
		priorityAreas: string[];
	};
	preferences: {
		learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'hands-on';
		timeAvailable: number; // hours per week
		preferredPace: 'slow' | 'moderate' | 'fast';
		budget?: number; // VND
		preferredFormat?: string[]; // ['online-course', 'books', 'mentoring']
	};
	motivation: {
		motivationLevel: number; // 1-10 scale
		commitmentLevel: number; // 1-10 scale
		biggestObstacles: string;
		supportSystem: string;
	};
	additional?: {
		additionalNotes?: string;
		specialRequests?: string;
	};
}
```

### Timeline Content Structure

```typescript
interface TimelineContent {
	overview: {
		totalDuration: string; // "24 months"
		phases: number; // 4
		estimatedEffort: string; // "10-15 hours/week"
		successProbability?: number; // 85%
	};
	phases: Array<{
		phase: number;
		title: string;
		description: string;
		duration: string;
		milestones: Array<{
			month: number;
			title: string;
			description: string;
			tasks: string[];
			resources: Array<{
				type: 'course' | 'book' | 'tool' | 'certification';
				title: string;
				url?: string;
				cost?: number;
			}>;
			checkpoints?: string[];
		}>;
	}>;
	recommendations: {
		dailyHabits: string[];
		weeklyGoals: string[];
		monthlyMilestones: string[];
	};
	budget?: {
		totalEstimated: number;
		breakdown: Array<{
			category: string;
			amount: number;
		}>;
	};
}
```

## Implementation Plan (2 Weeks)

### Week 1: Database & Core APIs

#### Day 1-2: Database Setup

```bash
# Create migrations using confirmed schema
npm run migration:generate src/database/migrations/CreateFormSubmissionsTable
npm run migration:generate src/database/migrations/CreateTimelinesTable
npm run migration:generate src/database/migrations/CreateAdminUsersTable
npm run migration:run

# Or execute SQL directly
mysql -u root -p personal_development < confirmed_schema.sql
```

#### Day 3-5: Core Module Structure

```typescript
src/v1/forms/
├── forms.controller.ts          // Submit form endpoint
├── forms.service.ts             // Form processing + validation
├── forms.module.ts
├── dto/
│   ├── submit-form.dto.ts       // Form submission DTO
│   └── form-response.dto.ts     // Response with timeline
└── repositories/
    └── form-submission.repository.ts

src/v1/timelines/
├── timelines.controller.ts      // View timeline by ID
├── timelines.service.ts         // Timeline display logic
├── timelines.module.ts
├── repositories/
│   └── timeline.repository.ts
└── responses/
    └── timeline-display.response.ts

src/database/
├── entities/
│   ├── form-submission.entity.ts
│   ├── timeline.entity.ts
│   └── admin-user.entity.ts
└── repositories/
    ├── form-submission.repository.ts
    ├── timeline.repository.ts
    └── admin-user.repository.ts
```

### Week 2: AI Integration & Polish

#### Day 6-8: AI Service

```typescript
src/services/ai/
├── ai.module.ts
├── openai.service.ts            // OpenAI API client
├── timeline-generator.service.ts // Prompt engineering
└── timeline-parser.service.ts   // Parse AI response

// AI Integration Flow
1. Validate form submission
2. Extract key fields (age, occupation, education_level)
3. Generate structured prompt
4. Call OpenAI API
5. Parse and validate response
6. Store timeline with metadata
7. Return complete response
```

#### Day 9-10: Rate Limiting & Utils

```typescript
src/utils/
├── ip-detection.util.ts         // Get real IP address
├── rate-limiter.util.ts         // Check daily_submission_count
└── json-validator.util.ts       // Validate form structure

// Rate Limiting Logic
1. Get user IP address
2. Count submissions today for this IP
3. Check against daily limit (2 submissions/day)
4. Update daily_submission_count
5. Allow or reject submission
```

## API Endpoints

### Core API Flow

```typescript
// Submit form and get immediate timeline
POST /api/v1/forms/submit
{
  "data": FormSubmissionData,  // Complete JSON object
  "age": 25,                   // Extracted for database column
  "occupation": "Developer",   // Extracted for database column
  "educationLevel": "University" // Extracted for database column
}

// Response with generated timeline
{
  "success": true,
  "submissionId": 123,
  "timeline": {
    "id": 456,
    "title": "Your Personal Development Journey",
    "viewUrl": "/api/v1/timelines/456",
    "phases": [...],
    "generatedAt": "2024-01-01T10:00:00Z"
  },
  "processing": {
    "status": "completed",
    "timeMs": 2340
  }
}

// View timeline by ID
GET /api/v1/timelines/:id
{
  "timeline": {
    "id": 456,
    "title": "Development Journey",
    "content": { /* full timeline structure */ },
    "metadata": {
      "generatedAt": "2024-01-01T10:00:00Z",
      "viewCount": 5,
      "isPublic": 0
    }
  }
}

// Increment view count
POST /api/v1/timelines/:id/view
{
  "success": true,
  "viewCount": 6
}

// Check if IP can submit (rate limiting)
GET /api/v1/forms/can-submit
{
  "canSubmit": true,
  "remainingSubmissions": 1,
  "resetTime": "2024-01-02T00:00:00Z"
}
```

### Optional Admin APIs

```typescript
// Simple admin authentication
POST /api/v1/admin/login
{
  "username": "admin",
  "password": "password"
}

// View submissions with filters
GET /api/v1/admin/submissions?page=1&limit=20&status=completed
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20
}

// View timelines with stats
GET /api/v1/admin/timelines?page=1&limit=20
{
  "data": [...],
  "total": 120,
  "averageViewCount": 3.5
}
```

## Environment Configuration

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal_development
DB_USERNAME=root
DB_PASSWORD=password

# AI Integration
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_TIMEOUT_MS=30000
OPENAI_MAX_TOKENS=4000

# Rate Limiting
MAX_SUBMISSIONS_PER_IP_PER_DAY=2
RATE_LIMIT_RESET_HOUR=0  # Reset at midnight

# Security
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=12

# Admin (Optional)
ADMIN_JWT_SECRET=your-jwt-secret
ADMIN_JWT_EXPIRATION=24h
```

## Key Features

### Rate Limiting Strategy

- Track `daily_submission_count` per IP address
- Reset count daily at midnight
- Allow maximum 2 submissions per IP per day
- Store error messages for failed submissions

### AI Processing Workflow

1. **Form Validation**: Validate JSON structure and required fields
2. **Data Extraction**: Extract age, occupation, education_level for indexing
3. **Prompt Generation**: Create structured prompt from form data
4. **AI API Call**: Send to OpenAI with timeout handling
5. **Response Parsing**: Parse and validate AI response JSON
6. **Timeline Storage**: Save to timelines table with metadata
7. **Immediate Response**: Return timeline to user instantly

### Error Handling

- **AI API Timeout**: Store error_message, retry mechanism
- **Invalid Form Data**: Return detailed validation errors
- **Rate Limit Exceeded**: Return retry time information
- **Database Errors**: Log errors, return generic message

---

**Project Timeline**: 2 weeks
**Team Requirements**: 1-2 developers
**Technology Stack**: NestJS + MySQL + OpenAI + TypeScript

**Budget Considerations**:

- OpenAI API costs: ~$100-300/month (depending on usage)
- Hosting: ~$20-50/month
- Database storage: ~$10/month

**Success Criteria**:

- ✅ Form submission with JSON data storage (confirmed schema)
- ✅ Real-time AI timeline generation (< 5s response)
- ✅ Timeline viewing by ID with view count tracking
- ✅ Rate limiting via daily_submission_count per IP
- ✅ Error handling with error_message storage
- ✅ Simple admin monitoring (optional)
- ✅ 95%+ success rate for timeline generation
