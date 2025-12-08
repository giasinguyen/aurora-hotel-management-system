# PostgreSQL 16 + pgvector
FROM pgvector/pgvector:pg16

# Set timezone
ENV TZ=Asia/Ho_Chi_Minh

# Expose postgres port
EXPOSE 5432

# Railway automatically injects env variables:
# PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, DATABASE_URL
# We map them to PostgreSQL default envs for entrypoint
ENV POSTGRES_USER=${PGUSER}
ENV POSTGRES_PASSWORD=${PGPASSWORD}
ENV POSTGRES_DB=${PGDATABASE}

# Optional: copy initialization SQL if you need
# COPY ./src/main/resources/db/init.sql /docker-entrypoint-initdb.d/init.sql
