export class NotificationService {
  async sendNotification(subject: string, templateUuid: string, data: any) {
    if (process.env.APP_ENV === 'dev') return;
    if (process.env.MAIL_NOTIFICATIONS_ENABLED === 'false') return;

    const emailServiceUrl = process.env.EMAIL_SERVICE_URL;
    const emailServiceApiKey = process.env.EMAIL_SERVICE_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!emailServiceUrl || !emailServiceApiKey || !notificationEmail) {
      console.warn('Email notification service not configured. Missing EMAIL_SERVICE_URL, EMAIL_SERVICE_API_KEY, or NOTIFICATION_EMAIL');
      return;
    }

    try {
      const emailResponse = await fetch(emailServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${emailServiceApiKey}`,
        },
        body: JSON.stringify({
          to: notificationEmail,
          subject,
          template: templateUuid,
          data,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email notification failed:', await emailResponse.text());
      }
    } catch (error) {
      console.error('Email notification error:', error);
      // Don't throw - email failures shouldn't break the request
    }
  }
}

