import { http, HttpResponse } from 'msw';
import { getProjectsByGroupId, mockProjects } from '../data/projects';

export const projectHandlers = [
  // Get projects (filterable by group_id)
  http.get('/api/projects', ({ request }) => {
    const url = new URL(request.url);
    const groupId = url.searchParams.get('group_id');

    if (groupId) {
      return HttpResponse.json(getProjectsByGroupId(groupId));
    }

    return HttpResponse.json(mockProjects);
  }),

  // Get single project
  http.get('/api/projects/:id', ({ params }) => {
    const { id } = params;
    const project = mockProjects.find((p) => p.id === id);

    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(project);
  }),

  // MOCK KILLER FEATURE: Auto-Sync LOC & Jira Status
  http.get('/api/projects/:id/sync-loc', ({ params }) => {
    const { id } = params;

    // Simulate latency of fetching from GitHub & Jira APIs
    // In reality, this endpoint would talk to Backend which talks to GitHub/Jira

    const mockSyncedData = [
      {
        id: 'feat-1',
        feature: 'Authentication',
        screen_function: 'Login Screen (Email/Password)',
        in_charge: 'Bui Thi Anh',
        status: 'Done',
        loc: 245,
        complexity: 'Medium',
        quality: 'High',
      },
      {
        id: 'feat-2',
        feature: 'Authentication',
        screen_function: 'Google OAuth Integration',
        in_charge: 'Luu Xuan Truong',
        status: 'In Progress',
        loc: 120,
        complexity: 'Complex',
        quality: 'Medium',
      },
      {
        id: 'feat-3',
        feature: 'Dashboard',
        screen_function: 'View Project List',
        in_charge: 'Le Huu Phuoc',
        status: 'Done',
        loc: 450,
        complexity: 'Simple',
        quality: 'High',
      },
      {
        id: 'feat-4',
        feature: 'Report Generation',
        screen_function: 'Export to Word (.docx)',
        in_charge: 'Nguyen Minh Duc',
        status: 'To Do',
        loc: 0,
        complexity: 'Complex',
        quality: 'Medium',
      },
    ];

    return HttpResponse.json(mockSyncedData);
  }),

  // MOCK KILLER FEATURE 2: Group Evaluation (Template 2)
  http.get('/api/projects/:id/evaluation', async ({ params }) => {
    const { id } = params;

    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockEvaluationData = [
      {
        id: 'eval-1',
        category: '1. Software Requirement Specification (SRS)',
        max_score: 1.0,
        score: 0.8,
        comment: 'Good use case diagrams.',
      },
      {
        id: 'eval-2',
        category: '2. Software Architecture & UI Design',
        max_score: 1.5,
        score: 1.2,
        comment: 'UI is clean, DB schema could be normalized more.',
      },
      {
        id: 'eval-3',
        category: '3. API Design & Documentation',
        max_score: 1.5,
        score: 1.4,
        comment: 'Swagger API defined well.',
      },
      {
        id: 'eval-4',
        category: '4. Project Source Code Quality',
        max_score: 3.5,
        score: 3.0,
        comment: 'Clean code, some minor lint warnings.',
      },
      {
        id: 'eval-5',
        category: '5. Software Testing (Unit/Integration)',
        max_score: 1.5,
        score: 1.0,
        comment: 'Missing integration tests for auth.',
      },
      {
        id: 'eval-6',
        category: '6. Project Management (Jira/GitHub)',
        max_score: 1.0,
        score: 0.9,
        comment: 'Good sprint velocity tracking.',
      },
    ];

    return HttpResponse.json(mockEvaluationData);
  }),
];
