CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS langchain_store (
   embedding_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
   text text,
   metadata json,
   embedding vector(768)
);

CREATE INDEX ON langchain_store USING HNSW (embedding vector_cosine_ops);