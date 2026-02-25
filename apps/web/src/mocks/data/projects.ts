export interface Project {
  id: string;
  group_id: string;
  name: string;
  description: string;
  github_repo_url: string | null;
  jira_project_key: string | null;
  created_at: string;
}

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    group_id: 'grp-001',
    name: 'Jira GitHub Manager (Team 1)',
    description:
      'A tool to automate SWP391 grading by synchronizing Jira and GitHub.',
    github_repo_url: 'https://github.com/WDP301-SP26/fe-repo',
    jira_project_key: 'JGM',
    created_at: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'proj-002',
    group_id: 'grp-001',
    name: 'Edu Platform (Team 2)',
    description: 'Online learning platform for students.',
    github_repo_url: 'https://github.com/WDP301-SP26/edu-platform',
    jira_project_key: 'EDU',
    created_at: '2026-01-10T00:00:00.000Z',
  },
];

export function getProjectsByGroupId(groupId: string): Project[] {
  return mockProjects.filter((project) => project.group_id === groupId);
}
