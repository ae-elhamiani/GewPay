#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    UPDATE pg_database SET datcollate='C', datctype='C' WHERE datname='graph-node';
    \c graph-node
    ALTER SCHEMA public OWNER TO graph-node;
EOSQL