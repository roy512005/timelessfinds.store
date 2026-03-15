import fs from 'fs';
const path = 'next.config.mjs';
let content = fs.readFileSync(path, 'utf8');
if (!content.includes('jaipurkurta.com')) {
    content = content.replace('remotePatterns: [', "remotePatterns: [\n            {\n                protocol: 'https',\n                hostname: 'jaipurkurta.com',\n            },");
    fs.writeFileSync(path, content);
    console.log('Updated next.config.mjs with jaipurkurta.com');
}
