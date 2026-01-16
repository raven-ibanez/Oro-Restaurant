-- Add Cash on Delivery payment method
INSERT INTO payment_methods (id, name, account_number, account_name, qr_code_url, sort_order, active) 
VALUES (
  'cod', 
  'Cash on Delivery', 
  'N/A', 
  'Internal', 
  'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 
  0, 
  true
)
ON CONFLICT (id) DO NOTHING;
