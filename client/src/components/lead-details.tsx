import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessLead } from "@shared/schema";

interface LeadDetailsProps {
  lead: BusinessLead;
}

export default function LeadDetails({ lead }: LeadDetailsProps) {
  const getWebsiteStatusText = (status: string) => {
    switch (status) {
      case 'NO_WEBSITE':
        return 'No Website';
      case 'SOCIAL_ONLY':
        return 'Social Only (Facebook)';
      case 'OUTDATED_SITE':
        return 'Outdated Website';
      default:
        return status;
    }
  };

  const getWebsiteStatusColor = (status: string) => {
    switch (status) {
      case 'NO_WEBSITE':
        return 'text-red-600';
      case 'SOCIAL_ONLY':
        return 'text-yellow-600';
      case 'OUTDATED_SITE':
        return 'text-orange-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Business Info */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2" data-testid="business-name">
              {lead.businessName}
            </h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Owner:</span>{' '}
                <span data-testid="owner-name">{lead.ownerName || 'Unknown'}</span>
              </p>
              <p>
                <span className="font-medium">Website Status:</span>{' '}
                <span className={getWebsiteStatusColor(lead.websiteStatus)} data-testid="website-status">
                  {getWebsiteStatusText(lead.websiteStatus)}
                </span>
              </p>
              <p>
                <span className="font-medium">Lead Score:</span>{' '}
                <span className="text-primary font-bold" data-testid="lead-score">
                  {lead.leadScore}/100
                </span>
              </p>
              <p>
                <span className="font-medium">Last Social Post:</span>{' '}
                <span data-testid="last-post">{lead.recentPosts || 'Unknown'}</span>
              </p>
              {lead.avgRating && (
                <p>
                  <span className="font-medium">Rating:</span>{' '}
                  <span data-testid="rating">
                    {lead.avgRating}/5 ({lead.numReviews} reviews)
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Personal Hook */}
          {lead.personalHook && (
            <div>
              <h5 className="text-sm font-semibold mb-2">Personal Hook</h5>
              <p className="text-sm bg-muted p-3 rounded-md italic" data-testid="personal-hook">
                "{lead.personalHook}"
              </p>
            </div>
          )}

          {/* Score Breakdown */}
          {lead.scoreBreakdown && (
            <div>
              <h5 className="text-sm font-semibold mb-2">Score Breakdown</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Website Problem (35%)</span>
                  <span className="font-medium" data-testid="score-website">
                    {Math.round(lead.scoreBreakdown.website.score)}/35
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Decision Maker (25%)</span>
                  <span className="font-medium" data-testid="score-decision-maker">
                    {Math.round(lead.scoreBreakdown.decisionMaker.score)}/25
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Social Activity (15%)</span>
                  <span className="font-medium" data-testid="score-social">
                    {Math.round(lead.scoreBreakdown.social.score)}/15
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reputation (15%)</span>
                  <span className="font-medium" data-testid="score-reputation">
                    {Math.round(lead.scoreBreakdown.reputation.score)}/15
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Size Match (10%)</span>
                  <span className="font-medium" data-testid="score-size">
                    {Math.round(lead.scoreBreakdown.sizeMatch.score)}/10
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h5 className="text-sm font-semibold mb-2">Contact Information</h5>
            <div className="text-sm space-y-1">
              {lead.emailBusiness && (
                <p>
                  <span className="font-medium">Business Email:</span>{' '}
                  <span data-testid="business-email">{lead.emailBusiness}</span>
                </p>
              )}
              {lead.ownerContact && (
                <p>
                  <span className="font-medium">Owner Contact:</span>{' '}
                  <span data-testid="owner-contact">{lead.ownerContact}</span>
                </p>
              )}
              {lead.phonePrimary && (
                <p>
                  <span className="font-medium">Phone:</span>{' '}
                  <span data-testid="phone">{lead.phonePrimary}</span>
                </p>
              )}
            </div>
          </div>

          {/* Confidence & Flags */}
          <div>
            <h5 className="text-sm font-semibold mb-2">Assessment</h5>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Confidence:</span>{' '}
                <span data-testid="confidence">{lead.confidence}%</span>
              </p>
              {lead.flags && lead.flags.length > 0 && (
                <p>
                  <span className="font-medium">Flags:</span>{' '}
                  <span className="text-yellow-600" data-testid="flags">
                    {lead.flags.join(', ')}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
