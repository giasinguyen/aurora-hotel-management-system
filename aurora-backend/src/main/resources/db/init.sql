CREATE EXTENSION IF NOT EXISTS vector;
SELECT * FROM pg_extension WHERE extname = 'vector';
SHOW SERVER_ENCODING;
SHOW TIMEZONE;
COMMENT ON EXTENSION vector IS 'Vector similarity search for RAG implementation';
