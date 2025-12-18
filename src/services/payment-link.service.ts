import Stripe from 'stripe';

export class PaymentLinkService {
  private stripe: Stripe | null = null;

  constructor() {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover' as Stripe.LatestApiVersion,
      });
    }
  }

  async createPropertyFeeLink(
    amountEur: number,
    productName: string = 'Property Fee (1 month rent)',
    description: string | null = null
  ): Promise<string | null> {
    if (!this.stripe) {
      console.warn('Stripe not configured, skipping payment link creation');
      return null;
    }

    try {
      const amountEurRounded = Math.ceil(amountEur);
      const unitAmount = Math.floor(amountEurRounded * 100);

      if (!description) {
        description = productName;
      }

      // Create product
      const product = await this.stripe.products.create({
        name: productName,
        description: description,
      });

      // Create price
      const price = await this.stripe.prices.create({
        unit_amount: unitAmount,
        currency: 'eur',
        product: product.id,
      });

      // Create payment link
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
      });

      return paymentLink.url;
    } catch (error: any) {
      console.error('Failed to create Stripe payment link:', error.message);
      return null;
    }
  }
}

