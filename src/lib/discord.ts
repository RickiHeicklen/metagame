interface DiscordWebhookPayload {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
    footer?: {
      text: string;
    };
  }>;
}

export async function sendDiscordWebhook(
  webhookUrl: string,
  payload: DiscordWebhookPayload
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
    return false;
  }
}

export function createTicketPurchaseEmbed(
  name: string,
  email: string,
  ticketType: string,
  price: number,
  paymentIntentId: string,
  originalPrice?: number,
  couponCode?: string,
  timestamp: string = new Date().toISOString()
) {
  const fields = [
    {
      name: '👤 Customer',
      value: name,
      inline: true,
    },
    {
      name: '📧 Email',
      value: email,
      inline: true,
    },
    {
      name: '🎟️ Ticket Type',
      value: ticketType,
      inline: true,
    },
  ];

  // Show price information
  if (originalPrice && originalPrice !== price && couponCode) {
    // Coupon was applied
    fields.push(
      {
        name: '💰 Original Price',
        value: `$${originalPrice.toFixed(2)}`,
        inline: true,
      },
      {
        name: '🎫 Coupon Applied',
        value: couponCode,
        inline: true,
      },
      {
        name: '💳 Final Price',
        value: `$${price.toFixed(2)}`,
        inline: true,
      }
    );
  } else {
    // No coupon applied
    fields.push({
      name: '💰 Price',
      value: `$${price.toFixed(2)}`,
      inline: true,
    });
  }

  fields.push(
    {
      name: '🆔 Payment ID',
      value: paymentIntentId,
      inline: true,
    },
    {
      name: '⏰ Purchase Time',
      value: new Date(timestamp).toLocaleString(),
      inline: true,
    },
    {
      name: '📊 View in Airtable',
      value: '[Click here to view tickets](https://airtable.com/appTvPARUssZp4qiB/shrqbCK5lYh0fJlyk)',
      inline: false,
    }
  );

  return {
    title: '🎫 New Ticket Purchase!',
    description: 'A new ticket has been purchased for Metagame.',
    color: 0x00ff00, // Green color
    fields,
    timestamp,
    footer: {
      text: 'Metagame Ticket System',
    },
  };
} 