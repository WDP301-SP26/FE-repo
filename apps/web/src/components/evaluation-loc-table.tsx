import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

// Matches the SWP391 Template 3 Structure
export interface LOCEvaluationItem {
  id: string;
  feature: string;
  screen_function: string;
  in_charge: string;
  status: 'In Progress' | 'To Do' | 'Done';
  loc: number;
  complexity: 'Simple' | 'Medium' | 'Complex';
  quality: 'High' | 'Medium' | 'Low';
}

interface EvaluationLOCTableProps {
  data: LOCEvaluationItem[];
  projectId: string;
}

export function EvaluationLOCTable({
  data,
  projectId,
}: EvaluationLOCTableProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [tableData, setTableData] = useState<LOCEvaluationItem[]>(data);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Mock API call to fetch LOC from GitHub and Status from Jira
      const res = await fetch(`/api/projects/${projectId}/sync-loc`);
      if (res.ok) {
        const syncedData = await res.json();
        setTableData(syncedData);
      }
    } catch (error) {
      console.error('Failed to sync data:', error);
    } finally {
      setTimeout(() => setIsSyncing(false), 800); // Fake delay for UX
    }
  };

  const handleExport = () => {
    const worksheetData = tableData.map((item) => ({
      Feature: item.feature,
      'Screen / Function': item.screen_function,
      'In Charge': item.in_charge,
      Status: item.status,
      LOC: item.loc,
      Complexity: item.complexity,
      Quality: item.quality,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LOC Evaluation');
    XLSX.writeFile(workbook, `Template3_LOC_Evaluation_${projectId}.xlsx`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'text-green-600 bg-green-50';
      case 'In Progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Auto-LOC Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            Synchronized with GitHub Commits and Jira Story Points.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={tableData.length === 0 || isSyncing}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
          <Button onClick={handleSync} disabled={isSyncing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Auto-Sync from Jira & GitHub'}
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Feature</TableHead>
              <TableHead>Screen / Function</TableHead>
              <TableHead className="w-[150px]">In Charge</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">LOC</TableHead>
              <TableHead className="w-[120px]">Complexity</TableHead>
              <TableHead className="w-[120px]">Quality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.feature}</TableCell>
                <TableCell>{item.screen_function}</TableCell>
                <TableCell>{item.in_charge}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {item.loc > 0 ? item.loc : '-'}
                </TableCell>
                <TableCell>{item.complexity}</TableCell>
                <TableCell>{item.quality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
