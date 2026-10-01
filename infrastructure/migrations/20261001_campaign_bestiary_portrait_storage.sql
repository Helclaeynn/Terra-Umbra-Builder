-- Match the existing custom-creature image allowance and campaign NPC storage budget.
-- Keep JSON object validation and a bounded total size, including inline portraits.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
ALTER TABLE campaign_bestiary
  DROP CONSTRAINT IF EXISTS campaign_bestiary_data_check;
ALTER TABLE campaign_bestiary
  ADD CONSTRAINT campaign_bestiary_data_check
  CHECK (jsonb_typeof(data) = 'object' AND octet_length(data::text) <= 800000);
COMMIT;
