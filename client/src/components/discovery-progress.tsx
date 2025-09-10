import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DiscoveryJob } from "@shared/schema";

interface DiscoveryProgressProps {
  job?: DiscoveryJob;
}

export default function DiscoveryProgress({ job }: DiscoveryProgressProps) {
  if (!job) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatus = (progress: number) => {
    if (progress === 100) return 'Completed';
    if (progress > 0) return `${progress}% Complete`;
    return 'Pending';
  };

  const getStepColor = (progress: number) => {
    return progress === 100 ? 'text-primary' : progress > 0 ? 'text-primary' : 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Discovery Progress</CardTitle>
          <Badge className={getStatusColor(job.status)} data-testid="status-badge">
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Google Places Search */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Google Places Search</span>
              <span className={`text-sm ${getStepColor(job.progress?.googlePlaces || 0)}`}>
                {getStepStatus(job.progress?.googlePlaces || 0)}
              </span>
            </div>
            <Progress 
              value={job.progress?.googlePlaces || 0} 
              className="h-2"
              data-testid="progress-google-places"
            />
          </div>
          
          {/* Social Media Analysis */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Social Media Analysis</span>
              <span className={`text-sm ${getStepColor(job.progress?.socialMedia || 0)}`}>
                {getStepStatus(job.progress?.socialMedia || 0)}
              </span>
            </div>
            <Progress 
              value={job.progress?.socialMedia || 0} 
              className="h-2"
              data-testid="progress-social-media"
            />
          </div>
          
          {/* Owner Verification */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Owner Verification</span>
              <span className={`text-sm ${getStepColor(job.progress?.ownerVerification || 0)}`}>
                {getStepStatus(job.progress?.ownerVerification || 0)}
              </span>
            </div>
            <Progress 
              value={job.progress?.ownerVerification || 0} 
              className="h-2"
              data-testid="progress-owner-verification"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="stat-total-found">
              {job.totalFound || 0}
            </div>
            <div className="text-xs text-muted-foreground">Businesses Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="stat-qualified-leads">
              {job.qualifiedLeads || 0}
            </div>
            <div className="text-xs text-muted-foreground">Qualified Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-1" data-testid="stat-high-score">
              {job.highScoreLeads || 0}
            </div>
            <div className="text-xs text-muted-foreground">High Score (≥80)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-4" data-testid="stat-verified-owners">
              {job.verifiedOwners || 0}
            </div>
            <div className="text-xs text-muted-foreground">Verified Owners</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
