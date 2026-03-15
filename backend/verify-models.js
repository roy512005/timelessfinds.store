/**
 * Temporary verification script to ensure all 52 Mongoose models 
 * load without syntax errors or broken mongoose boundaries.
 */

import fs from 'fs';
import path from 'path';

const modelsDir = path.join(process.cwd(), 'src', 'models');

async function verifyModels() {
    console.log(`Verifying models in ${modelsDir}...`);
    const files = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
        try {
            // dynamic import
            await import(`file://${path.join(modelsDir, file)}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error loading ${file}:`, error.message);
            failCount++;
        }
    }

    console.log(`\nVerification Complete.`);
    console.log(`✅ Passed: ${successCount}`);
    if (failCount > 0) {
        console.log(`❌ Failed: ${failCount}`);
        process.exit(1);
    }
}

verifyModels();
