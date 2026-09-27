ALTER TABLE compendium_portrait_visibility
  DROP CONSTRAINT IF EXISTS compendium_portrait_visibility_visibility_check;
ALTER TABLE compendium_portrait_visibility
  ADD CONSTRAINT compendium_portrait_visibility_visibility_check
  CHECK (visibility IN ('mj', 'public', 'removed'));
