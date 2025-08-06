-- Insert sample FD data from the CSV file with corrected status values
INSERT INTO public.fixed_deposits (
  name, 
  client_id, 
  original_amount, 
  interest_rate, 
  tenure_years, 
  status, 
  maturity_date, 
  current_value, 
  maturity_amount
) VALUES 
  ('Sai Venkatesh', '982741', 300000, 7.25, 5, 'Active', '2028-04-10', 375000, 440000),
  ('Meera Nair', '784512', 500000, 6.90, 3, 'Matured', '2024-01-01', 500000, 603500),
  ('Ravi Sharma', '659843', 150000, 7.00, 2, 'Active', '2024-07-15', 171000, 171000),
  ('Anita Desai', '873214', 1000000, 6.50, 10, 'Active', '2030-03-20', 1300000, 1950000),
  ('Farhan Ali', '194857', 225000, 7.10, 4, 'Closed', '2026-10-01', 0, 289000),
  ('Divya Kapoor', '305681', 450000, 6.75, 6, 'Active', '2029-05-05', 520000, 648000);