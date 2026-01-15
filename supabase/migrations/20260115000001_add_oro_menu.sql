/*
  # Add Oro Restaurant Menu Items

  1. New Categories
    - Add vegetables, meat, solo-meals, group-meals, snacks-drinks categories
    - Ensure existing noodles and rice-dishes categories are active

  2. New Menu Items
    - Insert items for all categories: Noodles, Vegetables, Meat, Rice, Solo Meals, Group Meals, Snacks & Drinks
    - Split items with multiple sizes or choices into individual entries
    - Add descriptions based on item names
*/

-- First, clear all existing icons to remove emojis
UPDATE categories SET icon = '';

-- Then, add/update categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('noodles', 'Noodles', '', 1, true),
  ('vegetables', 'Vegetables', '', 2, true),
  ('meat', 'Meat', '', 3, true),
  ('rice-dishes', 'Rice', '', 4, true),
  ('solo-meals', 'Solo Meals', '', 5, true),
  ('group-meals', 'Group Meals', '', 6, true),
  ('snacks-drinks', 'Snacks & Drinks', '', 7, true)
ON CONFLICT (id) DO UPDATE SET 
  active = true, 
  name = EXCLUDED.name, 
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- Noodles
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Chicken Mami', 'Traditional Filipino noodle soup with chicken', 150, 'noodles', false, true),
  ('Pork Mami', 'Traditional Filipino noodle soup with pork', 150, 'noodles', false, true),
  ('Canton', 'Stir-fried flour noodles with vegetables and meat', 155, 'noodles', true, true),
  ('Sweet and Spicy Canton', 'Stir-fried flour noodles with a sweet and spicy kick', 155, 'noodles', false, true),
  ('Canton-Bihon', 'Mix of stir-fried flour and rice noodles', 155, 'noodles', false, true),
  ('Bihon Pino', 'Stir-fried fine rice noodles', 150, 'noodles', false, true),
  ('Bihon Pino Sabaw', 'Fine rice noodle soup', 150, 'noodles', false, true),
  ('Pancit Ulam', 'Special pancit dish', 150, 'noodles', false, true),
  ('Pancit Ulam Sabaw', 'Pancit dish with broth', 150, 'noodles', false, true),
  ('Mike-Bihon Guisado', 'Stir-fried thick and fine noodle mix', 150, 'noodles', false, true),
  ('Mike-Bihon Sabaw', 'Thick and fine noodle mix soup', 150, 'noodles', false, true),
  ('Chamih', 'Stir-fried thick miki noodles', 155, 'noodles', false, true),
  ('Sweet and Spicy Chamih', 'Stir-fried thick miki noodles with sweet and spicy sauce', 155, 'noodles', false, true),
  ('Sotanghon Guisado', 'Stir-fried glass noodles', 165, 'noodles', false, true),
  ('Sotanghon Sabaw', 'Glass noodle soup', 165, 'noodles', false, true),
  ('Lomi', 'Thick egg noodle soup', 165, 'noodles', false, true),
  ('Lobihon', 'Combination of lomi and bihon', 165, 'noodles', false, true),
  ('Lomisua', 'Combination of lomi and misua', 165, 'noodles', false, true),
  ('Misua Sabaw', 'Fine flour noodle soup', 150, 'noodles', false, true),
  ('Kimlo', 'Special Chinese-style noodle soup', 165, 'noodles', false, true),
  ('Squidballs Misua Sabaw', 'Misua soup with squidballs', 180, 'noodles', false, true),
  ('Bola Bola Misua Sabaw', 'Misua soup with meatballs', 225, 'noodles', false, true),
  ('Chamisua', 'Stir-fried misua dish', 190, 'noodles', false, true);

-- Vegetables
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Chopsuey Guisado', 'Stir-fried mixed vegetables', 170, 'vegetables', true, true),
  ('Chopsuey Sabaw Special', 'Mixed vegetables in a special broth', 170, 'vegetables', false, true),
  ('Squidballs Chopsuey Sabaw', 'Mixed vegetable soup with squidballs', 190, 'vegetables', false, true),
  ('Hototay', 'Classic Chinese-Filipino meat and vegetable soup', 190, 'vegetables', false, true),
  ('Tokwa Guisado', 'Stir-fried tofu', 160, 'vegetables', false, true),
  ('Tokwa con Tausi', 'Tofu with black bean sauce', 160, 'vegetables', false, true),
  ('Ampalaya con Chicken', 'Bitter gourd with chicken', 175, 'vegetables', false, true),
  ('Ampalaya con Carne', 'Bitter gourd with beef/meat', 175, 'vegetables', false, true),
  ('Asparagus Chicken Soup', 'Creamy or clear asparagus soup with chicken', 175, 'vegetables', false, true),
  ('Asparagus Pork Soup', 'Creamy or clear asparagus soup with pork', 175, 'vegetables', false, true);

-- Meat
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Torta Special', 'Special Filipino omelette', 160, 'meat', false, true),
  ('Torta Regular', 'Classic Filipino omelette', 125, 'meat', false, true),
  ('Lumpiang Shanghai', 'Crispy spring rolls with meat filling', 180, 'meat', true, true),
  ('Fried Pork', 'Crispy fried pork slices', 180, 'meat', false, true),
  ('Fried Liver', 'Crispy fried liver', 170, 'meat', false, true),
  ('Pork Steak', 'Filipino-style pork steak with onions', 200, 'meat', false, true),
  ('Liver Steak', 'Filipino-style liver steak with onions', 185, 'meat', false, true),
  ('Atay Guisado', 'Stir-fried liver', 185, 'meat', false, true),
  ('Pork Sisig', 'Sizzling chopped pork with onions and chilies', 185, 'meat', true, true),
  ('Porkchop', 'Fried pork chop', 190, 'meat', false, true),
  ('Pork Sinigang', 'Sour tamarind soup with pork', 220, 'meat', true, true),
  ('Pork Adobo', 'Pork braised in soy sauce and vinegar', 200, 'meat', true, true),
  ('Batchoy Sabaw', 'Noodle soup with pork offal and cracklings', 230, 'meat', false, true),
  ('Bola Bola con Sarsa', 'Meatballs in savory sauce', 215, 'meat', false, true),
  ('Bola Bola Sabaw', 'Meatball soup', 215, 'meat', false, true),
  ('Sweet and Sour Pork', 'Crispy pork in tangy sweet and sour sauce', 220, 'meat', true, true),
  ('Mahkih', 'Traditional thick meat soup', 215, 'meat', false, true),
  ('Mahkihmi', 'Thick meat soup with noodles', 240, 'meat', false, true),
  ('Bagnet', 'Crispy deep-fried pork belly', 270, 'meat', true, true),
  ('Spicy Chicken Wings', 'Crispy wings with a spicy kick', 245, 'meat', false, true),
  ('Fried Chicken (Half)', 'Crispy fried chicken - Half serving', 210, 'meat', false, true),
  ('Fried Chicken (Whole)', 'Crispy fried chicken - Whole serving', 420, 'meat', false, true),
  ('Chicken Adobo (Half)', 'Chicken braised in soy sauce and vinegar - Half serving', 250, 'meat', false, true),
  ('Chicken Adobo (Whole)', 'Chicken braised in soy sauce and vinegar - Whole serving', 500, 'meat', false, true),
  ('Chicken Curry (Half)', 'Filipino-style chicken curry - Half serving', 250, 'meat', false, true),
  ('Chicken Curry (Whole)', 'Filipino-style chicken curry - Whole serving', 500, 'meat', false, true),
  ('Sweet & Sour Chicken (Half)', 'Chicken in sweet and sour sauce - Half serving', 250, 'meat', false, true),
  ('Sweet & Sour Chicken (Whole)', 'Chicken in sweet and sour sauce - Whole serving', 500, 'meat', false, true),
  ('Chicken Caldereta', 'Chicken stew in tomato sauce and liver spread', 550, 'meat', false, true),
  ('Crispy Pata (Small)', 'Crispy deep-fried pork leg - Small', 390, 'meat', true, true),
  ('Crispy Pata (Medium)', 'Crispy deep-fried pork leg - Medium', 470, 'meat', true, true),
  ('Crispy Pata (Large)', 'Crispy deep-fried pork leg - Large', 650, 'meat', true, true),
  ('Patatim (Small)', 'Braised pork leg in sweet savory sauce - Small', 410, 'meat', false, true),
  ('Patatim (Medium)', 'Braised pork leg in sweet savory sauce - Medium', 490, 'meat', false, true),
  ('Patatim (Large)', 'Braised pork leg in sweet savory sauce - Large', 670, 'meat', false, true),
  ('Siomai (12pcs)', 'Steamed pork and shrimp dumplings', 180, 'meat', false, true);

-- Rice
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Plain Rice', 'Steamed white rice', 25, 'rice-dishes', false, true),
  ('Garlic Rice', 'Fried rice with toasted garlic', 75, 'rice-dishes', true, true),
  ('Soy Rice', 'Rice seasoned with soy sauce', 75, 'rice-dishes', false, true),
  ('Fried Rice', 'Classic stir-fried rice', 95, 'rice-dishes', false, true);

-- Solo Meals
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Chicken BBQ Rice Meal', 'Grilled chicken BBQ served with rice', 170, 'solo-meals', true, true),
  ('Chicken Fillet Rice Meal', 'Breaded chicken fillet served with rice', 130, 'solo-meals', false, true),
  ('Mahkih Set', 'Traditional meat soup served as a meal', 130, 'solo-meals', false, true),
  ('Beef Tapsilog', 'Cured beef, garlic rice, and fried egg', 150, 'solo-meals', true, true),
  ('Pork Tapsilog', 'Cured pork, garlic rice, and fried egg', 130, 'solo-meals', false, true),
  ('Pork Tocilog', 'Sweet cured pork, garlic rice, and fried egg', 130, 'solo-meals', false, true),
  ('Oro Toppings', 'Special rice topping with Egg, Soy Rice, and choice of Lumpia or Bola-Bola', 130, 'solo-meals', true, true),
  ('Chicken Patty', 'Chicken patty with choice of Sweet&Sour or Curry sauce', 95, 'solo-meals', false, true);

-- Group Meals
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Small Bilao Noodles (6-10 pax)', 'Noodles served in a small bilao, perfect for 6-10 people', 500, 'group-meals', true, true),
  ('Medium Bilao Noodles (10-15 pax)', 'Noodles served in a medium bilao, perfect for 10-15 people', 670, 'group-meals', true, true),
  ('Large Bilao Noodles (15-20 pax)', 'Noodles served in a large bilao, perfect for 15-20 people', 820, 'group-meals', true, true),
  ('Siomai Platter (30 pcs)', 'Platter of 30 pieces steamed siomai', 420, 'group-meals', false, true),
  ('Lumpia Shanghai Bilao (50 pcs)', 'Platter of 50 pieces crispy lumpia shanghai', 680, 'group-meals', true, true),
  ('Wings Bilao (24 pcs)', 'Platter of 24 pieces spicy chicken wings', 680, 'group-meals', false, true),
  ('Assorted Chicken Bilao (30 pcs)', 'Platter of 30 pieces assorted fried chicken', 1380, 'group-meals', false, true),
  ('Mahkih Trio XL', 'Extra large serving of our signature Mahkih', 360, 'group-meals', false, true);

-- Snacks & Drinks
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Hopia Baboy Sir Norman Baker', 'Classic hopia baboy from Sir Norman Baker', 0, 'snacks-drinks', false, true),
  ('Turones Sir Norman Baker', 'Sweet turones from Sir Norman Baker', 0, 'snacks-drinks', false, true),
  ('Uraro', 'Traditional uraro cookies', 0, 'snacks-drinks', false, true),
  ('Chicharon Baboy', 'Crispy pork cracklings', 0, 'snacks-drinks', false, true),
  ('1.5L Soda', 'Choice of Coke, Royal, or Sprite (1.5L)', 0, 'snacks-drinks', false, true),
  ('Mismo 237ml Soda', 'Choice of Coke, Royal, or Sprite (237ml)', 0, 'snacks-drinks', false, true),
  ('Bottled Water (500ml)', 'Refreshing bottled mineral water', 0, 'snacks-drinks', false, true);
