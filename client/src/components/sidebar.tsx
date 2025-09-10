import { User, Search, List, Star, Mail, Download } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Search className="text-primary-foreground text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lead Discovery</h1>
            <p className="text-xs text-muted-foreground">Agent Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md bg-accent text-accent-foreground"
              data-testid="nav-new-search"
            >
              <Search className="text-sm" />
              <span className="text-sm font-medium">New Search</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              data-testid="nav-all-leads"
            >
              <List className="text-sm" />
              <span className="text-sm font-medium">All Leads</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              data-testid="nav-high-score"
            >
              <Star className="text-sm" />
              <span className="text-sm font-medium">High Score Leads</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              data-testid="nav-outreach"
            >
              <Mail className="text-sm" />
              <span className="text-sm font-medium">Outreach Messages</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              data-testid="nav-exports"
            >
              <Download className="text-sm" />
              <span className="text-sm font-medium">Exports</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="text-muted-foreground text-sm" />
          </div>
          <div>
            <p className="text-sm font-medium">Alex Rodriguez</p>
            <p className="text-xs text-muted-foreground">Agent Operator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
