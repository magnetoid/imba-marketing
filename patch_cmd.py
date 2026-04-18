import yaml
import sys

with open('/data/coolify/applications/u46q4bzn4vrp4r62cplm4x0c/docker-compose.yaml', 'r') as f:
    compose = yaml.safe_load(f)

if 'edge-runtime' in compose['services']:
    compose['services']['edge-runtime']['command'] = 'start --main-service /home/deno/functions/main/index.ts'

with open('/data/coolify/applications/u46q4bzn4vrp4r62cplm4x0c/docker-compose.yaml', 'w') as f:
    yaml.dump(compose, f, default_flow_style=False, sort_keys=False)
print("done")
