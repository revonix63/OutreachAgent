import { useState } from "react";
import Sidebar from "@/components/sidebar";
import SearchConfigComponent from "@/components/search-config";
import DiscoveryProgress from "@/components/discovery-progress";
import LeadsTable from "@/components/leads-table";
import LeadDetails from "@/components/lead-details";
import OutreachMessages from "@/components/outreach-messages";
import { Button } from "@/components/ui/button";
import { Settings, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BusinessLead } from "@shared/schema";

export default function Dashboard() {
  const [selectedLead, setSelectedLead] = useState<BusinessLead | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const { data: leads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery<BusinessLead[]>({
    queryKey: ["/api/leads"],
    enabled: true,
  });

  const { data: discoveryJob, refetch: refetchJob } = useQuery<any>({
    queryKey: ["/api/discovery", currentJobId],
    enabled: !!currentJobId,
    refetchInterval: currentJobId ? 2000 : false, // Poll every 2 seconds if job is running
  });

  const handleRunDiscovery = (config: any) => {
    fetch("/api/discovery/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
      .then(res => res.json())
      .then(data => {
        setCurrentJobId(data.jobId);
        refetchJob();
      })
      .catch(error => console.error("Failed to start discovery:", error));
  };

  const handleLeadSelect = (lead: BusinessLead) => {
    setSelectedLead(lead);
  };

  const handleRefreshLeads = () => {
    refetchLeads();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Business Lead Discovery</h2>
              <p className="text-sm text-muted-foreground">
                Find high-quality local business leads for website services
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" data-testid="button-settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button 
                size="sm" 
                data-testid="button-run-discovery"
                disabled={discoveryJob?.status === 'running'}
              >
                <Play className="mr-2 h-4 w-4" />
                {discoveryJob?.status === 'running' ? 'Running...' : 'Run Discovery'}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Search Configuration */}
          <div className="mb-8">
            <SearchConfigComponent onRunDiscovery={handleRunDiscovery} />
          </div>

          {/* Discovery Progress */}
          {currentJobId && (
            <div className="mb-8">
              <DiscoveryProgress job={discoveryJob} />
            </div>
          )}

          {/* Leads Table */}
          <div className="mb-8">
            <LeadsTable 
              leads={leads}
              onLeadSelect={handleLeadSelect}
              onRefresh={handleRefreshLeads}
              isLoading={leadsLoading}
            />
          </div>

          {/* Lead Details and Outreach */}
          {selectedLead && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadDetails lead={selectedLead} />
              <OutreachMessages lead={selectedLead} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
