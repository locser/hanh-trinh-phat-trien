# Personal Development Journey System (Hệ Thống Hành Trình Phát Triển Bản Thân)

## 🎯 Project Overview

Một hệ thống thu thập thông tin phát triển bản thân qua form ẩn danh, lưu trữ dữ liệu có cấu trúc và cung cấp API cho admin quản lý. Hệ thống được thiết kế để kết nối với AI phân tích bên thứ 3 để tạo ra các timeline phát triển cá nhân hóa.

## 🚀 Features

### Core Features

- ✅ **Anonymous Form Submission**: Thu thập thông tin người dùng không cần đăng nhập
- ✅ **User Identification**: Phân biệt người dùng bằng IP address + browser fingerprint
- ✅ **Rate Limiting**: Ngăn chặn spam với giới hạn submissions per IP per day
- ✅ **Admin Panel**: Giao diện quản trị để xem và review submissions
- ✅ **Database Structure**: Schema tối ưu cho việc tích hợp AI bên ngoài

### Form Data Collection

Hệ thống thu thập thông tin toàn diện về:

#### sheet 1

- **Thông tin cá nhân**: Tên, tuổi, nghề nghiệp, trình độ học vấn

#### sheet 2

- **Lĩnh Vực Muốn Phát Triển**: Lĩnh Vực Muốn Phát Triển
- **Mục tiêu**: Ngắn hạn (3-6 tháng), trung hạn (1-2 năm), dài hạn (3-5 năm)
- **Thời Gian Có Thể Dành Ra Mỗi Ngày (giờ)**: Thời Gian Có Thể Dành Ra Mỗi Ngày (giờ)

#### sheet 3

- **Đánh giá kiến thức hiện tại**: Mới bắt đầu -> Chuyên gia (1-10)
- **Kỹ Năng Mềm**: Kỹ năng mềm : Giao tiếp, Làm việc nhóm, Lãnh đạo, Quản lý thời gian, Tư duy phản biện, Sáng tạo (có hay không (number để sau này nếu đổi thành đánh giá điểm số))
- **Kinh Nghiệm Thực Tế**: Kinh Nghiệm Thực Tế

#### sheet 4: Sở Thích Học Tập

- **🎨 Phong Cách Học Tập Ưa Thích**: Phong cách học, thời gian có sẵn, tốc độ ưa thích
- **Ngân Sách Đầu Tư**: số tiền
- **⏰ Deadline Mong Muốn**: 3 tháng, 6 tháng, ... linh hoạt

## 🏗️ Technical Architecture

### Technology Stack

- **Backend**: NestJS với TypeScript
- **Database**: MySQL với TypeORM
- **Authentication**: JWT cho admin (có thể sẽ sau này)
- **Rate Limiting**: @nestjs/throttler
- **Validation**: class-validator + class-transformer

### Database Schema

```sql
-- Anonymous Users: Phân biệt người dùng bằng IP + fingerprint
anonymous_users (id, ip_address, browser_fingerprint, user_agent, ...)

-- Form Submissions: Dữ liệu phát triển bản thân đầy đủ
development_submissions (id, anonymous_user_id, full_name, age, current_skills, goals, ...)

-- Admin Users: Quản trị viên
admin_users (id, username, password_hash, email, ...)

```

## 📚 API Documentation

### Public Endpoints (Anonymous)

```bash
# Submit development form
POST /api/v1/submissions
Content-Type: application/json

{
  "browserFingerprint": "unique_browser_signature",
  "fullName": "Nguyễn Văn A",
  "age": 25,
  "currentSkills": ["JavaScript", "React", "Node.js"],
  "shortTermGoals": "Học TypeScript trong 6 tháng",
  "motivationLevel": 8,
  ...
}

# Check if user can submit (rate limiting)
GET /api/v1/submissions/can-submit
```

### Admin Endpoints

```bash
# Admin login
POST /api/v1/admin/login
{
  "username": "admin",
  "password": "password"
}

# List all submissions with pagination & filters
GET /api/v1/admin/submissions?page=1&limit=20&status=pending

# Get specific submission details
GET /api/v1/admin/submissions/:id

# Update submission (mark as reviewed, add notes)
PUT /api/v1/admin/submissions/:id
{
  "status": "reviewed",
  "adminNotes": "Good quality submission"
}

# Dashboard statistics
GET /api/v1/admin/dashboard
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm hoặc yarn

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Update database configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal_development
DB_USERNAME=root
DB_PASSWORD=your_password

# Admin JWT configuration
ADMIN_JWT_SECRET=your-super-secret-key
ADMIN_JWT_EXPIRATION=24h

# Rate limiting
MAX_SUBMISSIONS_PER_IP_PER_DAY=3
RATE_LIMIT_WINDOW_MINUTES=60

# CORS settings
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```bash
# Install dependencies
npm install

# Generate and run migrations
npm run migration:generate src/database/migrations/CreateInitialTables
npm run migration:run

# Create default admin user (optional)
npm run seed:admin
```

## 🔒 Security Features

<!-- ### Rate Limiting

- Maximum 3 submissions per IP per day
- 60-minute sliding window for rate limiting
- Browser fingerprinting để phân biệt users trên cùng IP -->

<!-- ### Browser Fingerprinting

```javascript
// Client-side fingerprint generation
const fingerprint = {
	screen: `${screen.width}x${screen.height}`,
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	language: navigator.language,
	platform: navigator.platform,
	canvas: generateCanvasFingerprint(),
	webgl: getWebGLFingerprint(),
};
``` -->

### Data Protection

- Input validation và sanitization
- No PII storage without consent
- GDPR compliant data handling
- Secure admin authentication

## 📊 Admin Dashboard Features

### Submission Management

- View all submissions với pagination
- Filter theo status, date range, IP
- Export data as CSV/Excel
- Bulk actions cho multiple submissions

### Analytics

- Daily/weekly submission trends
- Geographic distribution (by IP)
- Form completion rates
- Data quality metrics

### System Settings

- Update rate limiting configurations
- Manage external AI integration settings
- Monitor system health

## 🤖 External AI Integration

### Data Structure for AI

Submissions được format sẵn cho AI processing:

```json
{
  "submission_id": "12345",
  "user_data": {
    "demographics": { "age": 25, "occupation": "Developer" },
    "current_state": { "skills": [...], "challenges": "..." },
    "goals": { "short_term": "...", "long_term": "..." },
    "preferences": { "learning_style": "visual", "time_available": 10 }
  },
  "metadata": {
    "submitted_at": "2024-01-01T00:00:00Z",
    "source": "web_form"
  }
}
```

### Webhook Support

- Send submission data to external AI via webhook
- Receive processing results
- Track AI processing status
- Handle failures và retries

## 🚀 Deployment

### Docker Deployment

```bash
# Build container
docker build -t personal-development-api .

# Run with docker-compose
docker-compose up -d
```

### Production Configuration

```bash
# Environment variables for production
NODE_ENV=production
DB_SSL=true
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_REDIS_URL=redis://redis-server:6379
```

## 📈 Monitoring & Analytics

### Performance Metrics

- API response times
- Database query performance
- Rate limiting effectiveness
- Form submission success rates

### Business Metrics

- Daily active users (unique IPs)
- Form completion rates
- Data quality scores
- Admin review efficiency

## 🔄 Development Roadmap

### Phase 1 (Current): Core System ✅

- [x] Anonymous form submission
- [x] Admin panel
- [x] Rate limiting
- [x] Database schema

### Phase 2: Enhanced Features

- [ ] Advanced analytics dashboard
- [ ] CSV/Excel export functionality
- [ ] Email notifications for admins
- [ ] Advanced spam detection

### Phase 3: AI Integration

- [ ] Real-time AI webhook integration
- [ ] Processing status tracking
- [ ] Result visualization
- [ ] A/B testing for form optimization

## 📞 Support & Contact

### Development Team

- **Backend**: NestJS + TypeORM specialists
- **Database**: MySQL optimization experts
- **Security**: Rate limiting và spam prevention

### Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎯 Mission**: Tạo ra một hệ thống thu thập dữ liệu phát triển bản thân hiệu quả, bảo mật và dễ tích hợp với các hệ thống AI phân tích.

**📧 Contact**: [your-email@domain.com](mailto:your-email@domain.com)
