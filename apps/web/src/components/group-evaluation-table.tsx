import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export interface GroupEvaluationItem {
  id: string;
  category: string;
  max_score: number;
  score: number;
  comment: string;
}

interface GroupEvaluationTableProps {
  projectId: string;
}

export function GroupEvaluationTable({ projectId }: GroupEvaluationTableProps) {
  const [data, setData] = useState<GroupEvaluationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/evaluation`);
        if (res.ok) {
          const evalData = await res.json();
          setData(evalData);
        }
      } catch (error) {
        console.error('Failed to fetch group evaluation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchEvaluation();
    }
  }, [projectId]);

  const handleExport = () => {
    const worksheetData = data.map((item) => ({
      'Criteria / Category': item.category,
      'Max Score': item.max_score,
      Score: item.score,
      Comments: item.comment,
    }));

    // Add Total Row
    worksheetData.push({
      'Criteria / Category': 'Total Grade',
      'Max Score': data.reduce((acc, curr) => acc + curr.max_score, 0),
      Score: data.reduce((acc, curr) => acc + curr.score, 0),
      Comments: '',
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Group Evaluation');
    XLSX.writeFile(workbook, `Template2_GroupEvaluation_${projectId}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center animate-pulse">
        Loading group evaluation...
      </div>
    );
  }

  const totalMaxScore = data.reduce((acc, curr) => acc + curr.max_score, 0);
  const totalScore = data.reduce((acc, curr) => acc + curr.score, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Team Evaluation Rubric</h3>
          <p className="text-sm text-muted-foreground">
            Overall project assessment based on SWP391 criteria.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <div className="text-sm text-muted-foreground">Total Score</div>
            <div className="text-2xl font-bold text-primary">
              {totalScore.toFixed(1)} / {totalMaxScore.toFixed(1)}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={data.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">Criteria / Category</TableHead>
              <TableHead className="w-[100px] text-right">Max Score</TableHead>
              <TableHead className="w-[100px] text-right">Score</TableHead>
              <TableHead>Lecturer Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No evaluation criteria generated yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {item.max_score.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <span
                      className={
                        item.score < item.max_score / 2
                          ? 'text-red-500'
                          : 'text-green-600'
                      }
                    >
                      {item.score.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="italic text-muted-foreground">
                    {item.comment}
                  </TableCell>
                </TableRow>
              ))
            )}
            {data.length > 0 && (
              <TableRow className="bg-muted/20 font-bold border-t-2">
                <TableCell>Total Grade</TableCell>
                <TableCell className="text-right">
                  {totalMaxScore.toFixed(1)}
                </TableCell>
                <TableCell className="text-right text-primary">
                  {totalScore.toFixed(1)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
