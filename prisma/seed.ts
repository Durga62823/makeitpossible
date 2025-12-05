import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    // Clean existing data (in correct order due to foreign keys)
    console.log("🧹 Cleaning existing data...");
    await prisma.codeReview.deleteMany();
    await prisma.technicalMetric.deleteMany();
    await prisma.timesheetEntry.deleteMany();
    await prisma.timesheet.deleteMany();
    await prisma.pTORequest.deleteMany();
    await prisma.oneOnOne.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.task.deleteMany();
    await prisma.sprint.deleteMany();
    await prisma.appraisalReview.deleteMany();
    await prisma.appraisalCycle.deleteMany();
    await prisma.performanceMetric.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.userCustomRole.deleteMany();
    await prisma.customRole.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.team.deleteMany();
    await prisma.department.deleteMany();
    console.log("✅ Cleaned existing data\n");

    // Create Departments
    console.log("🏢 Creating departments...");
    const engineering = await prisma.department.create({
      data: {
        name: "Engineering",
        description: "Software Engineering Department",
      },
    });

    const product = await prisma.department.create({
      data: {
        name: "Product",
        description: "Product Management Department",
      },
    });
    console.log("✅ Created 2 departments\n");

    // Create Teams
    console.log("👥 Creating teams...");
    const frontendTeam = await prisma.team.create({
      data: {
        name: "Frontend Team",
        description: "React & Next.js Development",
        departmentId: engineering.id,
      },
    });

    const backendTeam = await prisma.team.create({
      data: {
        name: "Backend Team",
        description: "Node.js & API Development",
        departmentId: engineering.id,
      },
    });

    const productTeam = await prisma.team.create({
      data: {
        name: "Product Team",
        description: "Product Strategy & Planning",
        departmentId: product.id,
      },
    });
    console.log("✅ Created 3 teams\n");

    // Create Users
    console.log("👤 Creating users...");
    const hashedPassword = await hash("password123", 10);

    // Admin
    const admin = await prisma.user.create({
      data: {
        email: "admin@company.com",
        password: hashedPassword,
        name: "Alice Admin",
        firstName: "Alice",
        lastName: "Admin",
        role: "ADMIN",
        position: "Chief Technology Officer",
        status: "ACTIVE",
      },
    });

    // Managers
    const manager1 = await prisma.user.create({
      data: {
        email: "manager1@company.com",
        password: hashedPassword,
        name: "Bob Manager",
        firstName: "Bob",
        lastName: "Manager",
        role: "MANAGER",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        position: "Engineering Manager",
        status: "ACTIVE",
      },
    });

    const manager2 = await prisma.user.create({
      data: {
        email: "manager2@company.com",
        password: hashedPassword,
        name: "Carol Manager",
        firstName: "Carol",
        lastName: "Manager",
        role: "MANAGER",
        departmentId: engineering.id,
        teamId: backendTeam.id,
        position: "Engineering Manager",
        status: "ACTIVE",
      },
    });

    // Tech Leads
    const lead1 = await prisma.user.create({
      data: {
        email: "lead1@company.com",
        password: hashedPassword,
        name: "David Lead",
        firstName: "David",
        lastName: "Lead",
        role: "LEAD",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        managerId: manager1.id,
        position: "Tech Lead - Frontend",
        status: "ACTIVE",
      },
    });

    const lead2 = await prisma.user.create({
      data: {
        email: "lead2@company.com",
        password: hashedPassword,
        name: "Eve Lead",
        firstName: "Eve",
        lastName: "Lead",
        role: "LEAD",
        departmentId: engineering.id,
        teamId: backendTeam.id,
        managerId: manager2.id,
        position: "Tech Lead - Backend",
        status: "ACTIVE",
      },
    });

    // Employees - Frontend Team
    const emp1 = await prisma.user.create({
      data: {
        email: "dev1@company.com",
        password: hashedPassword,
        name: "Frank Developer",
        firstName: "Frank",
        lastName: "Developer",
        role: "EMPLOYEE",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        managerId: manager1.id,
        position: "Senior Frontend Developer",
        status: "ACTIVE",
      },
    });

    const emp2 = await prisma.user.create({
      data: {
        email: "dev2@company.com",
        password: hashedPassword,
        name: "Grace Developer",
        firstName: "Grace",
        lastName: "Developer",
        role: "EMPLOYEE",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        managerId: manager1.id,
        position: "Frontend Developer",
        status: "ACTIVE",
      },
    });

    const emp3 = await prisma.user.create({
      data: {
        email: "dev3@company.com",
        password: hashedPassword,
        name: "Henry Developer",
        firstName: "Henry",
        lastName: "Developer",
        role: "EMPLOYEE",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        managerId: manager1.id,
        position: "Junior Frontend Developer",
        status: "ACTIVE",
      },
    });

    // Employees - Backend Team
    const emp4 = await prisma.user.create({
      data: {
        email: "dev4@company.com",
        password: hashedPassword,
        name: "Ivy Developer",
        firstName: "Ivy",
        lastName: "Developer",
        role: "EMPLOYEE",
        departmentId: engineering.id,
        teamId: backendTeam.id,
        managerId: manager2.id,
        position: "Senior Backend Developer",
        status: "ACTIVE",
      },
    });

    const emp5 = await prisma.user.create({
      data: {
        email: "dev5@company.com",
        password: hashedPassword,
        name: "Jack Developer",
        firstName: "Jack",
        lastName: "Developer",
        role: "EMPLOYEE",
        departmentId: engineering.id,
        teamId: backendTeam.id,
        managerId: manager2.id,
        position: "Backend Developer",
        status: "ACTIVE",
      },
    });

    // Add the user's email as LEAD
    const userEmail = await prisma.user.upsert({
      where: { email: "psivadurgaprasad88@gmail.com" },
      update: {
        role: "LEAD",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        position: "Senior Tech Lead",
        status: "ACTIVE",
      },
      create: {
        email: "psivadurgaprasad88@gmail.com",
        name: "Siva Durga Prasad",
        firstName: "Siva",
        lastName: "Prasad",
        role: "LEAD",
        departmentId: engineering.id,
        teamId: frontendTeam.id,
        position: "Senior Tech Lead",
        status: "ACTIVE",
      },
    });

    console.log("✅ Created 12 users (1 Admin, 2 Managers, 3 Leads, 6 Employees)\n");

    // Create Projects
    console.log("📁 Creating projects...");
    const project1 = await prisma.project.create({
      data: {
        name: "E-Commerce Platform",
        description: "Next.js based e-commerce platform with real-time inventory",
        status: "ON_TRACK",
        ownerId: manager1.id,
        teamId: frontendTeam.id,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-06-30"),
        completionRate: 65,
      },
    });

    const project2 = await prisma.project.create({
      data: {
        name: "API Gateway Redesign",
        description: "Microservices API gateway with improved performance",
        status: "AT_RISK",
        ownerId: manager2.id,
        teamId: backendTeam.id,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2025-04-30"),
        completionRate: 45,
      },
    });

    const project3 = await prisma.project.create({
      data: {
        name: "Mobile App Development",
        description: "React Native mobile application",
        status: "ON_TRACK",
        ownerId: lead1.id,
        teamId: frontendTeam.id,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-12-31"),
        completionRate: 30,
      },
    });

    // Add project members
    await prisma.projectMember.createMany({
      data: [
        { projectId: project1.id, userId: lead1.id, role: "Tech Lead" },
        { projectId: project1.id, userId: emp1.id, role: "Developer" },
        { projectId: project1.id, userId: emp2.id, role: "Developer" },
        { projectId: project1.id, userId: emp3.id, role: "Developer" },
        { projectId: project2.id, userId: lead2.id, role: "Tech Lead" },
        { projectId: project2.id, userId: emp4.id, role: "Developer" },
        { projectId: project2.id, userId: emp5.id, role: "Developer" },
        { projectId: project3.id, userId: lead1.id, role: "Tech Lead" },
        { projectId: project3.id, userId: emp1.id, role: "Developer" },
      ],
    });

    console.log("✅ Created 3 projects with team members\n");

    // Create Sprints
    console.log("🏃 Creating sprints...");
    const sprint1 = await prisma.sprint.create({
      data: {
        name: "Sprint 12 - Q4 2024",
        goal: "Complete checkout flow and payment integration",
        teamId: frontendTeam.id,
        startDate: new Date("2024-11-18"),
        endDate: new Date("2024-12-01"),
        status: "COMPLETED",
        velocity: 42,
        capacityHours: 320,
        retrospectiveNotes: "Great sprint! Delivered all planned features. Need to improve code review turnaround time.",
      },
    });

    const sprint2 = await prisma.sprint.create({
      data: {
        name: "Sprint 13 - Q4 2024",
        goal: "User dashboard and analytics implementation",
        teamId: frontendTeam.id,
        startDate: new Date("2024-12-02"),
        endDate: new Date("2024-12-15"),
        status: "ACTIVE",
        capacityHours: 320,
      },
    });

    const sprint3 = await prisma.sprint.create({
      data: {
        name: "Sprint 14 - Q1 2025",
        goal: "Performance optimization and mobile responsiveness",
        teamId: frontendTeam.id,
        startDate: new Date("2024-12-16"),
        endDate: new Date("2024-12-29"),
        status: "PLANNING",
        capacityHours: 280,
      },
    });

    const sprint4 = await prisma.sprint.create({
      data: {
        name: "Backend Sprint 8",
        goal: "API rate limiting and caching layer",
        teamId: backendTeam.id,
        startDate: new Date("2024-12-02"),
        endDate: new Date("2024-12-15"),
        status: "ACTIVE",
        capacityHours: 240,
      },
    });

    console.log("✅ Created 4 sprints\n");

    // Create Tasks
    console.log("✅ Creating tasks...");
    const tasks = await prisma.task.createMany({
      data: [
        // Sprint 2 (Active) - Frontend Team
        {
          title: "Design user dashboard layout",
          description: "Create responsive dashboard with sidebar navigation and widget system",
          status: "DONE",
          priority: "HIGH",
          projectId: project1.id,
          assigneeId: emp1.id,
          reporterId: lead1.id,
          sprintId: sprint2.id,
          storyPoints: 5,
          estimatedHours: 16,
          actualHours: 14,
          tags: JSON.stringify(["ui", "dashboard", "design"]),
          acceptanceCriteria: "Dashboard responsive on all devices, sidebar collapsible",
          startedAt: new Date("2024-12-02"),
          completedAt: new Date("2024-12-05"),
        },
        {
          title: "Implement analytics charts",
          description: "Add Chart.js visualizations for user analytics data",
          status: "IN_PROGRESS",
          priority: "HIGH",
          projectId: project1.id,
          assigneeId: emp2.id,
          reporterId: lead1.id,
          sprintId: sprint2.id,
          storyPoints: 8,
          estimatedHours: 24,
          tags: JSON.stringify(["analytics", "charts", "visualization"]),
          acceptanceCriteria: "Show revenue, user growth, and engagement metrics",
          startedAt: new Date("2024-12-03"),
        },
        {
          title: "Build user settings page",
          description: "Profile settings with theme switcher and notification preferences",
          status: "IN_REVIEW",
          priority: "MEDIUM",
          projectId: project1.id,
          assigneeId: emp3.id,
          reporterId: lead1.id,
          sprintId: sprint2.id,
          storyPoints: 5,
          estimatedHours: 16,
          tags: JSON.stringify(["settings", "profile", "ui"]),
          prUrl: "https://github.com/example/pr/123",
          startedAt: new Date("2024-12-04"),
        },
        {
          title: "Add real-time notifications",
          description: "WebSocket integration for live notifications",
          status: "TODO",
          priority: "MEDIUM",
          projectId: project1.id,
          assigneeId: emp1.id,
          reporterId: lead1.id,
          sprintId: sprint2.id,
          storyPoints: 13,
          estimatedHours: 32,
          tags: JSON.stringify(["websocket", "realtime", "notifications"]),
          dueDate: new Date("2024-12-14"),
        },
        {
          title: "Fix dashboard loading performance",
          description: "Optimize initial load time and reduce bundle size",
          status: "BLOCKED",
          priority: "URGENT",
          projectId: project1.id,
          assigneeId: emp2.id,
          reporterId: lead1.id,
          sprintId: sprint2.id,
          storyPoints: 8,
          blockedReason: "Waiting for backend API optimization",
          tags: JSON.stringify(["performance", "optimization", "bug"]),
        },
        // Backend Team Sprint
        {
          title: "Implement Redis caching layer",
          description: "Add Redis for API response caching",
          status: "IN_PROGRESS",
          priority: "HIGH",
          projectId: project2.id,
          assigneeId: emp4.id,
          reporterId: lead2.id,
          sprintId: sprint4.id,
          storyPoints: 8,
          estimatedHours: 24,
          tags: JSON.stringify(["redis", "caching", "performance"]),
          startedAt: new Date("2024-12-03"),
        },
        {
          title: "API rate limiting middleware",
          description: "Implement rate limiting with Redis and token bucket algorithm",
          status: "IN_REVIEW",
          priority: "HIGH",
          projectId: project2.id,
          assigneeId: emp5.id,
          reporterId: lead2.id,
          sprintId: sprint4.id,
          storyPoints: 5,
          estimatedHours: 16,
          prUrl: "https://github.com/example/pr/124",
          startedAt: new Date("2024-12-02"),
        },
        {
          title: "Database query optimization",
          description: "Add indexes and optimize N+1 queries",
          status: "TODO",
          priority: "MEDIUM",
          projectId: project2.id,
          assigneeId: emp4.id,
          reporterId: lead2.id,
          sprintId: sprint4.id,
          storyPoints: 5,
          estimatedHours: 16,
          tags: JSON.stringify(["database", "optimization", "performance"]),
        },
        // Backlog items
        {
          title: "Mobile app home screen",
          description: "Design and implement mobile app home screen",
          status: "TODO",
          priority: "LOW",
          projectId: project3.id,
          reporterId: lead1.id,
          storyPoints: 8,
          estimatedHours: 24,
          tags: JSON.stringify(["mobile", "ui", "react-native"]),
        },
        {
          title: "User authentication flow",
          description: "Implement login/signup with biometric support",
          status: "TODO",
          priority: "HIGH",
          projectId: project3.id,
          reporterId: lead1.id,
          storyPoints: 13,
          estimatedHours: 40,
          tags: JSON.stringify(["auth", "security", "mobile"]),
        },
      ],
    });

    console.log("✅ Created 10 tasks\n");

    // Create Code Reviews
    console.log("🔍 Creating code reviews...");
    await prisma.codeReview.createMany({
      data: [
        {
          prUrl: "https://github.com/example/pr/123",
          prTitle: "feat: Add user settings page with theme switcher",
          authorId: emp3.id,
          reviewerId: lead1.id,
          status: "approved",
          linesChanged: 450,
          filesChanged: 8,
          comments: 5,
          createdAt: new Date("2024-12-04"),
          reviewedAt: new Date("2024-12-05"),
        },
        {
          prUrl: "https://github.com/example/pr/124",
          prTitle: "feat: Implement API rate limiting middleware",
          authorId: emp5.id,
          reviewerId: lead2.id,
          status: "changes_requested",
          linesChanged: 320,
          filesChanged: 5,
          comments: 12,
          createdAt: new Date("2024-12-02"),
          reviewedAt: new Date("2024-12-03"),
        },
        {
          prUrl: "https://github.com/example/pr/125",
          prTitle: "fix: Dashboard performance optimization",
          authorId: emp1.id,
          status: "pending",
          linesChanged: 180,
          filesChanged: 4,
          comments: 0,
          createdAt: new Date("2024-12-06"),
        },
      ],
    });

    console.log("✅ Created 3 code reviews\n");

    // Create Technical Metrics
    console.log("📊 Creating technical metrics...");
    const metricsDate = new Date("2024-12-01");
    await prisma.technicalMetric.createMany({
      data: [
        {
          teamId: frontendTeam.id,
          metricType: "pr_merge_time",
          value: 18.5,
          unit: "hours",
          period: "weekly",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-07"),
        },
        {
          teamId: frontendTeam.id,
          metricType: "code_review_time",
          value: 4.2,
          unit: "hours",
          period: "weekly",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-07"),
        },
        {
          teamId: frontendTeam.id,
          metricType: "build_time",
          value: 3.5,
          unit: "minutes",
          period: "daily",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-02"),
        },
        {
          teamId: frontendTeam.id,
          metricType: "deployment_frequency",
          value: 12,
          unit: "count",
          period: "weekly",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-07"),
        },
        {
          teamId: frontendTeam.id,
          metricType: "bug_count",
          value: 8,
          unit: "count",
          period: "sprint",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-15"),
        },
        {
          teamId: backendTeam.id,
          metricType: "pr_merge_time",
          value: 24.3,
          unit: "hours",
          period: "weekly",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-07"),
        },
        {
          teamId: backendTeam.id,
          metricType: "api_response_time",
          value: 145,
          unit: "milliseconds",
          period: "daily",
          periodStart: metricsDate,
          periodEnd: new Date("2024-12-02"),
        },
      ],
    });

    console.log("✅ Created 7 technical metrics\n");

    // Create PTO Requests
    console.log("🏖️ Creating PTO requests...");
    await prisma.pTORequest.createMany({
      data: [
        {
          userId: emp1.id,
          type: "VACATION",
          startDate: new Date("2024-12-23"),
          endDate: new Date("2024-12-27"),
          days: 5,
          reason: "Christmas vacation with family",
          status: "PENDING",
        },
        {
          userId: emp2.id,
          type: "SICK_LEAVE",
          startDate: new Date("2024-12-05"),
          endDate: new Date("2024-12-05"),
          days: 1,
          reason: "Doctor appointment",
          status: "APPROVED",
          approverId: manager1.id,
          approvedAt: new Date("2024-12-04"),
        },
        {
          userId: emp3.id,
          type: "VACATION",
          startDate: new Date("2025-01-15"),
          endDate: new Date("2025-01-22"),
          days: 6,
          reason: "Winter holiday trip",
          status: "PENDING",
        },
        {
          userId: emp4.id,
          type: "PERSONAL",
          startDate: new Date("2024-12-10"),
          endDate: new Date("2024-12-10"),
          days: 1,
          reason: "Personal matters",
          status: "APPROVED",
          approverId: manager2.id,
          approvedAt: new Date("2024-12-08"),
        },
        {
          userId: emp5.id,
          type: "VACATION",
          startDate: new Date("2024-12-20"),
          endDate: new Date("2025-01-02"),
          days: 10,
          reason: "Year-end vacation",
          status: "REJECTED",
          approverId: manager2.id,
          approvedAt: new Date("2024-12-01"),
          rejectionReason: "Too many team members on leave during this period",
        },
      ],
    });

    console.log("✅ Created 5 PTO requests\n");

    // Create Timesheets
    console.log("⏰ Creating timesheets...");
    const lastWeek = new Date("2024-11-25");
    const thisWeek = new Date("2024-12-02");
    
    const timesheet1 = await prisma.timesheet.create({
      data: {
        userId: emp1.id,
        weekStart: lastWeek,
        weekEnd: new Date("2024-12-01"),
        totalHours: 40,
        status: "APPROVED",
        approverId: manager1.id,
        approvedAt: new Date("2024-12-02"),
        entries: {
          create: [
            { date: new Date("2024-11-25"), projectId: project1.id, hours: 8, description: "Dashboard UI development", billable: true },
            { date: new Date("2024-11-26"), projectId: project1.id, hours: 8, description: "Dashboard UI development", billable: true },
            { date: new Date("2024-11-27"), projectId: project1.id, hours: 7, description: "Code review and bug fixes", billable: true },
            { date: new Date("2024-11-28"), projectId: project1.id, hours: 8, description: "Testing and documentation", billable: true },
            { date: new Date("2024-11-29"), hours: 9, description: "Team meeting and planning", billable: false },
          ],
        },
      },
    });

    const timesheet2 = await prisma.timesheet.create({
      data: {
        userId: emp2.id,
        weekStart: thisWeek,
        weekEnd: new Date("2024-12-08"),
        totalHours: 35,
        status: "SUBMITTED",
        entries: {
          create: [
            { date: new Date("2024-12-02"), projectId: project1.id, hours: 7, description: "Analytics charts implementation", billable: true },
            { date: new Date("2024-12-03"), projectId: project1.id, hours: 8, description: "Analytics charts implementation", billable: true },
            { date: new Date("2024-12-04"), projectId: project1.id, hours: 8, description: "Chart.js integration", billable: true },
            { date: new Date("2024-12-05"), hours: 1, description: "Sick leave", billable: false },
            { date: new Date("2024-12-06"), projectId: project1.id, hours: 6, description: "Testing and bug fixes", billable: true },
            { date: new Date("2024-12-07"), hours: 5, description: "Weekend work - urgent bug fix", billable: true },
          ],
        },
      },
    });

    const timesheet3 = await prisma.timesheet.create({
      data: {
        userId: emp4.id,
        weekStart: thisWeek,
        weekEnd: new Date("2024-12-08"),
        totalHours: 42,
        status: "SUBMITTED",
        entries: {
          create: [
            { date: new Date("2024-12-02"), projectId: project2.id, hours: 8, description: "Redis caching implementation", billable: true },
            { date: new Date("2024-12-03"), projectId: project2.id, hours: 9, description: "Redis caching implementation", billable: true },
            { date: new Date("2024-12-04"), projectId: project2.id, hours: 8, description: "Cache invalidation logic", billable: true },
            { date: new Date("2024-12-05"), projectId: project2.id, hours: 8, description: "Testing and optimization", billable: true },
            { date: new Date("2024-12-06"), projectId: project2.id, hours: 9, description: "Documentation and code review", billable: true },
          ],
        },
      },
    });

    console.log("✅ Created 3 timesheets with entries\n");

    // Create Goals
    console.log("🎯 Creating goals...");
    await prisma.goal.createMany({
      data: [
        {
          userId: emp1.id,
          title: "Master TypeScript Advanced Patterns",
          description: "Deep dive into advanced TypeScript patterns and generics",
          targetDate: new Date("2025-03-31"),
          progress: 45,
          status: "active",
        },
        {
          userId: emp2.id,
          title: "Contribute to Open Source",
          description: "Make 10 meaningful contributions to open source projects",
          targetDate: new Date("2025-06-30"),
          progress: 20,
          status: "active",
        },
        {
          userId: lead1.id,
          title: "Improve Team Code Quality",
          description: "Reduce bug count by 30% through better code review practices",
          targetDate: new Date("2025-02-28"),
          progress: 60,
          status: "active",
        },
      ],
    });

    console.log("✅ Created 3 goals\n");

    // Create 1:1 Meetings
    console.log("🤝 Creating 1:1 meetings...");
    await prisma.oneOnOne.createMany({
      data: [
        {
          managerId: manager1.id,
          employeeId: emp1.id,
          scheduledAt: new Date("2024-12-10T10:00:00"),
          duration: 30,
          topics: JSON.stringify(["Career goals", "Project feedback", "Skill development"]),
          completed: false,
        },
        {
          managerId: manager1.id,
          employeeId: emp2.id,
          scheduledAt: new Date("2024-12-05T14:00:00"),
          duration: 30,
          notes: "Discussed analytics project progress. Employee doing great work. Interested in learning more about data visualization.",
          topics: JSON.stringify(["Project status", "Learning opportunities"]),
          actionItems: JSON.stringify(["Enroll in data visualization course", "Shadow senior developer next sprint"]),
          completed: true,
        },
        {
          managerId: manager2.id,
          employeeId: emp4.id,
          scheduledAt: new Date("2024-12-12T15:00:00"),
          duration: 45,
          topics: JSON.stringify(["Performance review", "Promotion discussion", "Team dynamics"]),
          completed: false,
        },
      ],
    });

    console.log("✅ Created 3 1:1 meetings\n");

    // Create Appraisal Cycle
    console.log("📋 Creating appraisal cycle...");
    const appraisalCycle = await prisma.appraisalCycle.create({
      data: {
        name: "Q4 2024 Performance Review",
        description: "Quarterly performance review for Q4 2024",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-31"),
        status: "IN_PROGRESS",
      },
    });

    await prisma.appraisalReview.createMany({
      data: [
        {
          cycleId: appraisalCycle.id,
          userId: emp1.id,
          selfReview: "Strong quarter with successful delivery of dashboard features. Improved code quality and mentored junior developers.",
          managerReview: "Excellent performance. Consistently delivers high-quality work and shows leadership potential.",
          rating: 4.5,
          finalRating: 4.5,
          status: "COMPLETED",
          submittedAt: new Date("2024-12-05"),
          completedAt: new Date("2024-12-08"),
        },
        {
          cycleId: appraisalCycle.id,
          userId: emp2.id,
          selfReview: "Made good progress on analytics features. Need to improve estimation accuracy.",
          status: "IN_PROGRESS",
          submittedAt: new Date("2024-12-06"),
        },
        {
          cycleId: appraisalCycle.id,
          userId: emp3.id,
          status: "DRAFT",
        },
      ],
    });

    console.log("✅ Created appraisal cycle with 3 reviews\n");

    // Create Audit Logs
    console.log("📝 Creating audit logs...");
    await prisma.auditLog.createMany({
      data: [
        {
          userId: admin.id,
          action: "USER_CREATED",
          entity: "User",
          entityId: emp3.id,
          details: "Created new user: Henry Developer",
        },
        {
          userId: manager1.id,
          action: "APPRAISAL_COMPLETED",
          entity: "AppraisalReview",
          entityId: appraisalCycle.id,
          details: "Completed performance review for Frank Developer",
        },
        {
          userId: admin.id,
          action: "SETTINGS_UPDATED",
          entity: "OrganizationSettings",
          details: "Updated work hours: 09:00 - 17:00",
        },
      ],
    });

    console.log("✅ Created 3 audit logs\n");

    console.log("\n🎉 Database seeded successfully!\n");
    console.log("📧 Test Accounts Created:");
    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log("│ Role     │ Email                  │ Password                │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log("│ Admin    │ admin@company.com      │ password123             │");
    console.log("│ Manager  │ manager1@company.com   │ password123             │");
    console.log("│ Manager  │ manager2@company.com   │ password123             │");
    console.log("│ Lead     │ lead1@company.com      │ password123             │");
    console.log("│ Lead     │ lead2@company.com      │ password123             │");
    console.log("│ Lead     │ psivadurgaprasad88@... │ (your account)          │");
    console.log("│ Employee │ dev1@company.com       │ password123             │");
    console.log("│ Employee │ dev2@company.com       │ password123             │");
    console.log("│ Employee │ dev3@company.com       │ password123             │");
    console.log("│ Employee │ dev4@company.com       │ password123             │");
    console.log("│ Employee │ dev5@company.com       │ password123             │");
    console.log("└─────────────────────────────────────────────────────────┘\n");
    console.log("📊 Data Summary:");
    console.log("  - 2 Departments");
    console.log("  - 3 Teams");
    console.log("  - 12 Users");
    console.log("  - 3 Projects");
    console.log("  - 4 Sprints");
    console.log("  - 10 Tasks");
    console.log("  - 3 Code Reviews");
    console.log("  - 7 Technical Metrics");
    console.log("  - 5 PTO Requests");
    console.log("  - 3 Timesheets");
    console.log("  - 3 Goals");
    console.log("  - 3 1:1 Meetings");
    console.log("  - 1 Appraisal Cycle with 3 Reviews");
    console.log("  - 3 Audit Logs\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
