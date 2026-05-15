CREATE TABLE IF NOT EXISTS `{project_id}.{dataset}.{table}` (
  fecha DATE NOT NULL,
  category STRING NOT NULL,
  region STRING NOT NULL,
  revenue FLOAT64 NOT NULL,
  quantity INT64 NOT NULL,
  avg_price FLOAT64
);
