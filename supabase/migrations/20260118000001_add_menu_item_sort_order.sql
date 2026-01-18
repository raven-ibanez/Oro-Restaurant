-- Add sort_order column to menu_items
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'sort_order') THEN
    ALTER TABLE menu_items ADD COLUMN sort_order INTEGER DEFAULT 100;
  END IF;
END $$;

-- Set explicit sort_order for Vegetables to ensure Chopsuey Guisado is first
UPDATE menu_items SET sort_order = 1 WHERE name = 'Chopsuey Guisado' AND category = 'vegetables';
UPDATE menu_items SET sort_order = 2 WHERE name = 'Chopsuey Sabaw Special' AND category = 'vegetables';
UPDATE menu_items SET sort_order = 3 WHERE name = 'Squidballs Chopsuey Sabaw' AND category = 'vegetables';
UPDATE menu_items SET sort_order = 4 WHERE name = 'Hototay' AND category = 'vegetables';

-- Set explicit sort_order for Noodles
UPDATE menu_items SET sort_order = 1 WHERE name = 'Canton' AND category = 'noodles';
UPDATE menu_items SET sort_order = 2 WHERE name = 'Sweet and Spicy Canton' AND category = 'noodles';
-- Others will maintain their default 100 or can be updated as needed.
