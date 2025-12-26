-- Make display_page nullable since we removed it from the form
ALTER TABLE packages
ALTER COLUMN display_page DROP NOT NULL;

