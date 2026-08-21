# Notifications Gmail des messages de contact

Le formulaire enregistre d'abord chaque message dans `public.contact_messages`.
Un Database Webhook appelle ensuite l'Edge Function `notify-contact`, qui envoie une copie à
`parisnordelite@gmail.com` avec Resend.

## Configuration

1. Créer une clé API sur Resend.
2. Ajouter cette clé dans Supabase : Edge Functions > Secrets > `RESEND_API_KEY`.
3. Déployer `supabase/functions/notify-contact/index.ts` sous le nom `notify-contact`.
4. Dans Database > Webhooks, créer un webhook :
   - table : `public.contact_messages`
   - événement : `INSERT`
   - type : Supabase Edge Function
   - fonction : `notify-contact`
   - méthode : `POST`
   - authentification : ajouter l'en-tête avec la service key depuis l'interface Supabase

Ne jamais placer la service role key ou la clé Resend dans le code Angular.
