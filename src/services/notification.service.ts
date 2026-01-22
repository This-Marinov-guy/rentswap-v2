import nodemailer from 'nodemailer';

interface RoomListingData {
  propertyId: string;
  city: string;
  address: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
}
 interface RoomSearchingData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  budget: string | number;
  move_in: string;
  period: string;
  registration?: string;
  accommodationType?: string;
  peopleToAccommodate?: string;
}

export class NotificationService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Initialize Gmail SMTP transporter
    const gmailHost = process.env.GMAIL_HOST;
    const gmailPort = process.env.GMAIL_PORT;
    const gmailUsername = process.env.GMAIL_USERNAME;
    const gmailPassword = process.env.GMAIL_PASSWORD;
    const gmailEncryption = process.env.GMAIL_ENCRYPTION;
    const gmailFromAddress = process.env.GMAIL_FROM_ADDRESS;

    if (gmailHost && gmailPort && gmailUsername && gmailPassword && gmailFromAddress) {
      this.transporter = nodemailer.createTransport({
        host: gmailHost,
        port: parseInt(gmailPort, 10),
        secure: gmailEncryption === 'ssl', // true for 465, false for other ports
        auth: {
          user: gmailUsername,
          pass: gmailPassword,
        },
        tls: {
          rejectUnauthorized: false, // For development, set to true in production
        },
      });
    } else {
      console.warn('Gmail SMTP not configured. Missing GMAIL_HOST, GMAIL_PORT, GMAIL_USERNAME, GMAIL_PASSWORD, or GMAIL_FROM_ADDRESS');
    }
  }

  private formatRoomListingEmail(data: RoomListingData): { subject: string; html: string; text: string } {
    const subject = 'New Rentswap Room Listing Uploaded';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1d3557; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1d3557; }
            .value { margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Room Listing</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Property ID:</div>
                <div class="value">${data.propertyId}</div>
              </div>
              <div class="field">
                <div class="label">City:</div>
                <div class="value">${data.city}</div>
              </div>
              <div class="field">
                <div class="label">Address:</div>
                <div class="value">${data.address}</div>
              </div>
              ${data.name ? `
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.name}</div>
              </div>
              ` : ''}
              ${data.surname ? `
              <div class="field">
                <div class="label">Surname:</div>
                <div class="value">${data.surname}</div>
              </div>
              ` : ''}
              ${data.email ? `
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              ` : ''}
              ${data.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Quick Link:</div>
                <a href="https://www.domakin.nl/account/properties-list" target="_blank">Click here to see it</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
New Room Listing Uploaded

Property ID: ${data.propertyId}
City: ${data.city}
Address: ${data.address}
${data.name ? `Name: ${data.name}` : ''}
${data.surname ? `Surname: ${data.surname}` : ''}
${data.email ? `Email: ${data.email}` : ''}
${data.phone ? `Phone: ${data.phone}` : ''}
    `;

    return { subject, html, text };
  }

  private formatRoomSearchingEmail(data: RoomSearchingData): { subject: string; html: string; text: string } {
    const subject = "New Rentswap Rental Search Submission";
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1d3557; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1d3557; }
            .value { margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Rental Search Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Surname:</div>
                <div class="value">${data.surname}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              <div class="field">
                <div class="label">City:</div>
                <div class="value">${data.city}</div>
              </div>
              <div class="field">
                <div class="label">Budget:</div>
                <div class="value">€${data.budget}</div>
              </div>
              <div class="field">
                <div class="label">Move-in Date:</div>
                <div class="value">${data.move_in}</div>
              </div>
              <div class="field">
                <div class="label">Period:</div>
                <div class="value">${data.period}</div>
              </div>
              ${data.registration ? `
              <div class="field">
                <div class="label">Registration Required:</div>
                <div class="value">${data.registration}</div>
              </div>
              ` : ''}
              ${data.accommodationType ? `
              <div class="field">
                <div class="label">Accommodation Type:</div>
                <div class="value">${data.accommodationType}</div>
              </div>
              ` : ''}
              ${data.peopleToAccommodate ? `
              <div class="field">
                <div class="label">People to Accommodate:</div>
                <div class="value">${data.peopleToAccommodate}</div>
              </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
New Rental Search Submission

Name: ${data.name}
Surname: ${data.surname}
Email: ${data.email}
Phone: ${data.phone}
City: ${data.city}
Budget: €${data.budget}
Move-in Date: ${data.move_in}
Period: ${data.period}
${data.registration ? `Registration Required: ${data.registration}` : ''}
${data.accommodationType ? `Accommodation Type: ${data.accommodationType}` : ''}
${data.peopleToAccommodate ? `People to Accommodate: ${data.peopleToAccommodate}` : ''}
    `;

    return { subject, html, text };
  }

  async sendNotification(
    type: 'room_listing' | 'room_searching',
    data: RoomListingData | RoomSearchingData
  ): Promise<void> {
  

    // Skip in development if configured
    if (
      process.env.APP_ENV === "dev" &&
      process.env.MAIL_NOTIFICATIONS_ENABLED !== "1"
    ) {
      console.log('Notification disabled in development');
      return;
    }

    if (!this.transporter) {
      return;
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'admin@rentswap.nl';
    const fromAddress = process.env.GMAIL_FROM_ADDRESS || 'notification@domakin.nl';


    let emailContent: { subject: string; html: string; text: string };

    if (type === 'room_listing') {
      const listingData = data as RoomListingData;
      
      // Validate required fields
      if (!listingData.propertyId || !listingData.city || !listingData.address) {
        return;
      }
            
      emailContent = this.formatRoomListingEmail(listingData);
    } else {
      emailContent = this.formatRoomSearchingEmail(data as RoomSearchingData);
    }

    try {
      await this.transporter.sendMail({
        from: fromAddress,
        to: notificationEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (error) {
      console.log('Error sending email', error);
      throw error;
      // Don't throw - email failures shouldn't break the request
    }
  }

  // Legacy method for backward compatibility
  async sendNotificationLegacy(subject: string, templateUuid: string, data: RoomListingData | RoomSearchingData): Promise<void> {
    // Map template UUIDs to notification types
    if (templateUuid === 'room_listing') {
      await this.sendNotification('room_listing', data);
    } else if (templateUuid === 'new-rental-search' || templateUuid === 'room_searching') {
      await this.sendNotification('room_searching', data);
    } else {
      console.warn(`Unknown template UUID: ${templateUuid}`);
    }
  }
}
