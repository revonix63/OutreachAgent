import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Send, RefreshCw } from "lucide-react";
import { BusinessLead } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface OutreachMessagesProps {
  lead: BusinessLead;
}

interface OutreachData {
  messages: {
    email: string;
    dm: string;
    sms: string;
  };
  alternatives: {
    formal: {
      email: string;
      dm: string;
      sms: string;
    };
    casual: {
      email: string;
      dm: string;
      sms: string;
    };
  };
}

export default function OutreachMessages({ lead }: OutreachMessagesProps) {
  const [selectedTone, setSelectedTone] = useState<'default' | 'formal' | 'casual'>('default');
  const { toast } = useToast();

  const { data: outreachData, isLoading, refetch } = useQuery({
    queryKey: ['/api/leads', lead.id, 'outreach'],
    queryFn: async () => {
      const response = await apiRequest('POST', `/api/leads/${lead.id}/outreach`);
      return response.json() as Promise<OutreachData>;
    },
  });

  const sendOutreachMutation = useMutation({
    mutationFn: async () => {
      // This would integrate with actual email/messaging services
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Outreach sent!",
        description: "Your outreach messages have been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send",
        description: "There was an error sending your outreach messages.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} message copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getCurrentMessages = () => {
    if (!outreachData) return null;
    
    switch (selectedTone) {
      case 'formal':
        return outreachData.alternatives.formal;
      case 'casual':
        return outreachData.alternatives.casual;
      default:
        return outreachData.messages;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Outreach Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Generating personalized messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const messages = getCurrentMessages();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated Outreach Messages</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTone === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTone('default')}
              data-testid="tone-default"
            >
              Default
            </Button>
            <Button
              variant={selectedTone === 'formal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTone('formal')}
              data-testid="tone-formal"
            >
              Formal
            </Button>
            <Button
              variant={selectedTone === 'casual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTone('casual')}
              data-testid="tone-casual"
            >
              Casual
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {messages ? (
          <div className="space-y-6">
            {/* Email Message */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-primary">Email</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(messages.email, 'Email')}
                  data-testid="copy-email"
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={messages.email}
                readOnly
                className="min-h-32 bg-muted"
                data-testid="email-content"
              />
            </div>

            {/* Social DM */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-primary">Facebook/Instagram DM</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(messages.dm, 'DM')}
                  data-testid="copy-dm"
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={messages.dm}
                readOnly
                className="min-h-24 bg-muted"
                data-testid="dm-content"
              />
            </div>

            {/* SMS/WhatsApp */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-primary">SMS/WhatsApp</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(messages.sms, 'SMS')}
                  data-testid="copy-sms"
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={messages.sms}
                readOnly
                className="min-h-20 bg-muted"
                data-testid="sms-content"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No outreach messages available</p>
          </div>
        )}

        {messages && (
          <div className="mt-6 flex space-x-3">
            <Button
              className="flex-1"
              onClick={() => sendOutreachMutation.mutate()}
              disabled={sendOutreachMutation.isPending}
              data-testid="send-outreach"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendOutreachMutation.isPending ? 'Sending...' : 'Send Outreach'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="regenerate-messages"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
