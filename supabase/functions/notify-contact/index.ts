const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RECIPIENT_EMAIL = 'parisnordelite@gmail.com';

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface DatabaseWebhookPayload {
  type: 'INSERT';
  table: 'contact_messages';
  schema: 'public';
  record: ContactMessage;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY) {
    return Response.json({ error: 'RESEND_API_KEY is missing' }, { status: 500 });
  }

  const payload = (await request.json()) as DatabaseWebhookPayload;
  const contact = payload.record;

  if (!contact?.name || !contact?.email || !contact?.message) {
    return Response.json({ error: 'Invalid contact message' }, { status: 400 });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Paris Nord Élite <onboarding@resend.dev>',
      to: [RECIPIENT_EMAIL],
      reply_to: contact.email,
      subject: `[PNE Contact] ${contact.subject}`,
      html: `
        <h2>Nouveau message depuis le site Paris Nord Élite</h2>
        <p><strong>Nom :</strong> ${escapeHtml(contact.name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(contact.email)}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(contact.subject)}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(contact.message).replaceAll('\n', '<br>')}</p>
      `,
    }),
  });

  const result = await response.json();
  return Response.json(result, { status: response.status });
});
