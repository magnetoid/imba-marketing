const fs = require('fs');
const yaml = require('yaml');

const compose = yaml.parse(fs.readFileSync('temp_compose3.yaml', 'utf8'));

if (!compose.services['edge-runtime']) {
    compose.services['edge-runtime'] = {
        image: 'supabase/edge-runtime:v1.70.3',
        container_name: 'imba-edge-runtime',
        restart: 'unless-stopped',
        networks: ['imba-net'],
        environment: {
            SITE_URL: 'https://imbamarketing.com',
            JWT_SECRET: '${JWT_SECRET:-your-super-secret-jwt-key-min-32-chars}',
            VERIFY_JWT: 'false',
            SUPABASE_URL: 'http://supabase-kong:8000',
            SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY:-your-anon-key}',
            SUPABASE_SERVICE_ROLE_KEY: '${SUPABASE_SERVICE_KEY:-your-service-key}',
            SUPABASE_DB_URL: 'postgres://${POSTGRES_USER:-supabase}:${POSTGRES_PASSWORD:-changeme_postgres}@supabase-db:5432/${POSTGRES_DB:-imba_production}'
        },
        volumes: ['./supabase/functions:/home/deno/functions:ro'],
        command: 'start --main-service /home/deno/functions/main/index.ts',
        ports: ['127.0.0.1:9166:10000'],
        labels: ['traefik.enable=false']
    };
} else {
    compose.services['edge-runtime'].command = 'start --main-service /home/deno/functions/main/index.ts';
    compose.services['edge-runtime'].ports = ['127.0.0.1:9166:10000'];
}

if (compose.services['supabase-kong'] && compose.services['supabase-kong'].depends_on) {
    if (Array.isArray(compose.services['supabase-kong'].depends_on)) {
        compose.services['supabase-kong'].depends_on = compose.services['supabase-kong'].depends_on.filter(d => d !== 'edge-runtime');
    }
}

if (compose.volumes && compose.volumes['postgres-data']) {
    compose.volumes['postgres-data'] = {
        external: true,
        name: 'u46q4bzn4vrp4r62cplm4x0c_postgres-data'
    };
}

if (compose.services['imba-web']) {
    compose.services['imba-web'].image = 'u46q4bzn4vrp4r62cplm4x0c_imba-web:1cf7828d66ba6650f7a25ec5c59cc08bdc436c2c';
}

fs.writeFileSync('temp_compose3.yaml', yaml.stringify(compose));