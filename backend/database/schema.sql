CREATE TABLE components (
  id SERIAL PRIMARY KEY,
  part_code TEXT UNIQUE NOT NULL,
  component_name TEXT,
  current_stock INTEGER CHECK (current_stock >= 0),
  monthly_required_quantity INTEGER,
  ok_count INTEGER,
  scrap_count INTEGER,
  total_count INTEGER,
  nff_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pcbs (
  id SERIAL PRIMARY KEY,
  pcb_part_code TEXT UNIQUE NOT NULL,
  product_description TEXT,
  status TEXT,
  analysis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pcb_components (
  id SERIAL PRIMARY KEY,
  pcb_id INTEGER REFERENCES pcbs(id) ON DELETE CASCADE,
  component_id INTEGER REFERENCES components(id) ON DELETE CASCADE,
  quantity_required INTEGER DEFAULT 1
);

CREATE TABLE production_entries (
  id SERIAL PRIMARY KEY,
  pcb_id INTEGER REFERENCES pcbs(id),
  quantity_produced INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE consumption_history (
  id SERIAL PRIMARY KEY,
  component_id INTEGER REFERENCES components(id),
  pcb_id INTEGER REFERENCES pcbs(id),
  quantity_deducted INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);