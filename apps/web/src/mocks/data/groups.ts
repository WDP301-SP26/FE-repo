export interface Group {
  id: string;
  name: string;
  semester: string;
  created_by_id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  github_organization: string | null;
  jira_project_key: string | null;
  created_at: string;
  updated_at: string;
}

export const mockGroups: Group[] = [
  {
    id: 'grp-001',
    name: 'Class SE1730 - SWP391',
    semester: 'SP26',
    created_by_id: 'lecturer-001', // Assigned to Dr. Nguyen Van A
    status: 'ACTIVE',
    github_organization: 'WDP301-SP26',
    jira_project_key: 'JGM',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'grp-002',
    name: 'Class SE1731 - SWP391',
    semester: 'SP26',
    created_by_id: 'lecturer-001',
    status: 'ACTIVE',
    github_organization: null,
    jira_project_key: null,
    created_at: '2026-01-02T00:00:00.000Z',
    updated_at: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'grp-003',
    name: 'Class SE1605 - SWP391',
    semester: 'FA25',
    created_by_id: 'lecturer-001',
    status: 'ARCHIVED',
    github_organization: 'WDP301-FA25',
    jira_project_key: 'JGM-FA25',
    created_at: '2025-08-01T00:00:00.000Z',
    updated_at: '2025-12-01T00:00:00.000Z',
  },
];

export function getGroupsByLecturer(lecturerId: string): Group[] {
  return mockGroups.filter((group) => group.created_by_id === lecturerId);
}
