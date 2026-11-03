-- Messages privés à la table : une révélation du MJ à un seul joueur, ou une note d'un
-- joueur au MJ. Un événement privé n'est lu que par le MJ, son destinataire et son auteur.
ALTER TABLE campaign_live_events ADD COLUMN IF NOT EXISTS recipient_id uuid REFERENCES users(id) ON DELETE CASCADE;
