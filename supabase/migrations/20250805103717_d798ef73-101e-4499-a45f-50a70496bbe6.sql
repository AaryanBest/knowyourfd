-- Create FD data table
CREATE TABLE public.fixed_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tenure_years INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Matured', 'Closed')),
  interest_rate DECIMAL(4,2) NOT NULL,
  original_amount DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) NOT NULL,
  maturity_date DATE NOT NULL,
  maturity_amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fixed_deposits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is a demo app)
CREATE POLICY "Allow public read access to FDs" 
ON public.fixed_deposits 
FOR SELECT 
USING (true);

-- Create policy to allow public insert access (for demo purposes)
CREATE POLICY "Allow public insert access to FDs" 
ON public.fixed_deposits 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fixed_deposits_updated_at
BEFORE UPDATE ON public.fixed_deposits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.fixed_deposits (client_id, name, tenure_years, status, interest_rate, original_amount, current_value, maturity_date, maturity_amount) VALUES
('FD001', 'John Doe', 3, 'Active', 7.50, 100000, 125000, '2025-12-15', 127500),
('FD002', 'Jane Smith', 5, 'Matured', 8.00, 250000, 350000, '2024-06-20', 350000),
('FD003', 'Robert Johnson', 2, 'Active', 7.25, 500000, 575000, '2026-03-10', 580000),
('FD004', 'Maria Garcia', 4, 'Closed', 7.75, 150000, 165000, '2024-11-30', 170000);