'use client';

import { EvaluationLOCTable } from '@/components/evaluation-loc-table';
import { GroupEvaluationTable } from '@/components/group-evaluation-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          console.error('Failed to fetch project:', res.status);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="p-8 text-center animate-pulse">
        Loading project data...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-red-500">Project not found.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Jira Project Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {project.jira_project_key || 'Not linked'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              GitHub Repository
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm truncate">
              {project.github_repo_url ? (
                <a
                  href={project.github_repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {project.github_repo_url}
                </a>
              ) : (
                'Not linked'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Group Evaluation (Template 2)
          </h2>
          <GroupEvaluationTable projectId={projectId} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Student LOC & Performance Evaluation
          </h2>
          {/* We pass empty data initially, let the Sync button fetch it */}
          <EvaluationLOCTable data={[]} projectId={projectId} />
        </section>
      </div>
    </div>
  );
}
