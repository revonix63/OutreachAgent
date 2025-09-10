import { BusinessLead } from '@shared/schema';

export interface OutreachMessages {
  email: string;
  dm: string;
  sms: string;
}

export class OutreachService {
  generateOutreachMessages(lead: BusinessLead): OutreachMessages {
    const businessName = lead.businessName;
    const ownerName = lead.ownerName || 'there';
    const personalHook = lead.personalHook || `I noticed ${businessName} has a strong local presence`;
    const demoLink = lead.demoDesktopScreenshotUrl || '[demo-link]';

    return {
      email: this.generateEmailMessage(businessName, ownerName, personalHook, demoLink),
      dm: this.generateDMMessage(businessName, ownerName, personalHook, demoLink),
      sms: this.generateSMSMessage(businessName, ownerName, demoLink),
    };
  }

  private generateEmailMessage(businessName: string, ownerName: string, personalHook: string, demoLink: string): string {
    return `Subject: Quick idea for ${businessName}'s website (30s demo)

Hi ${ownerName},

${personalHook} — love it. I made a quick 1-page website mockup for ${businessName} so you can see how a modern site could bring more walk-ins and reservations. 

Here's a 20s demo: ${demoLink}

If you like what you see, I'll set it live and keep it simple — no monthly headaches, just customers. Want me to send a version with your logo and opening hours?

— Alex`;
  }

  private generateDMMessage(businessName: string, ownerName: string, personalHook: string, demoLink: string): string {
    return `Hey ${ownerName} — ${personalHook.toLowerCase()}. Made a short website demo for ${businessName} (30s). Link: ${demoLink}. If you want, I can swap in your logo & menu and get it live so customers find you. Interested?`;
  }

  private generateSMSMessage(businessName: string, ownerName: string, demoLink: string): string {
    return `Hey ${ownerName}, quick site demo for ${businessName}: ${demoLink} — I can swap your menu/logo & publish it. Want that?`;
  }

  generateAlternativeMessages(lead: BusinessLead): { formal: OutreachMessages; casual: OutreachMessages } {
    const baseMessages = this.generateOutreachMessages(lead);
    
    // Generate more formal versions
    const formal: OutreachMessages = {
      email: this.makeFormalTone(baseMessages.email),
      dm: this.makeFormalTone(baseMessages.dm),
      sms: this.makeFormalTone(baseMessages.sms),
    };

    // Generate more casual versions
    const casual: OutreachMessages = {
      email: this.makeCasualTone(baseMessages.email),
      dm: this.makeCasualTone(baseMessages.dm),
      sms: this.makeCasualTone(baseMessages.sms),
    };

    return { formal, casual };
  }

  private makeFormalTone(message: string): string {
    return message
      .replace(/Hey /g, 'Hello ')
      .replace(/ — /g, '. ')
      .replace(/love it/g, 'appreciate it')
      .replace(/Want that\?/g, 'Would you be interested?');
  }

  private makeCasualTone(message: string): string {
    return message
      .replace(/Hello /g, 'Hey ')
      .replace(/appreciate it/g, 'love it')
      .replace(/Would you be interested\?/g, 'Want that?');
  }
}
