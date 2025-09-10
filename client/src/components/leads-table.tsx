import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Filter, Download, RefreshCw } from "lucide-react";
import { BusinessLead } from "@shared/schema";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface LeadsTableProps {
  leads: BusinessLead[];
  onLeadSelect: (lead: BusinessLead) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function LeadsTable({ leads, onLeadSelect, onRefresh, isLoading }: LeadsTableProps) {
  const getWebsiteStatusColor = (status: string) => {
    switch (status) {
      case 'NO_WEBSITE':
        return 'bg-red-100 text-red-800';
      case 'SOCIAL_ONLY':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUTDATED_SITE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-chart-1';
    if (score >= 70) return 'text-chart-2';
    return 'text-muted-foreground';
  };

  const handleExportCSV = () => {
    window.open('/api/leads/export/csv', '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discovered Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading leads...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Discovered Leads</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" data-testid="button-filter">
              <Filter className="mr-1 h-4 w-4" />
              Filter
            </Button>
            <Button variant="secondary" size="sm" onClick={onRefresh} data-testid="button-refresh">
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="default" size="sm" onClick={handleExportCSV} data-testid="button-export-csv">
              <Download className="mr-1 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No leads found. Run a discovery search to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Website Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50" data-testid={`row-lead-${lead.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">{lead.businessName}</div>
                        <div className="text-sm text-muted-foreground">
                          {lead.address}, {lead.city}, {lead.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">{lead.ownerName || 'Unknown'}</div>
                        {lead.ownerVerified ? (
                          <CheckCircle className="text-primary ml-2 h-4 w-4" />
                        ) : (
                          <AlertTriangle className="text-yellow-500 ml-2 h-4 w-4" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getWebsiteStatusColor(lead.websiteStatus)}>
                        {lead.websiteStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-bold ${getScoreColor(lead.leadScore)}`}>
                          {lead.leadScore}
                        </span>
                        <div className="ml-2 w-16">
                          <Progress value={lead.leadScore} className="h-2" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {lead.emailBusiness || lead.ownerContact || lead.phonePrimary || 'No contact'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLeadSelect(lead)}
                        className="text-primary hover:text-primary/80 mr-3"
                        data-testid={`button-view-${lead.id}`}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                        data-testid={`button-outreach-${lead.id}`}
                      >
                        Outreach
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
