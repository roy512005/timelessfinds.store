import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createItem, getItems, getItemById, updateItem, deleteItem } from '../controllers/genericController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.join(__dirname, '..', 'models');

const router = express.Router();

/**
 * Dynamically mounts REST API routes for all models in the models directory.
 * e.g. User.js becomes /api/v1/user
 */
export const mountDynamicRoutes = async (app) => {
    console.log('[Dynamic Router] Scanning models directory for dynamic API generation...');
    const files = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));

    for (const file of files) {
        try {
            const modelName = file.replace('.js', '');

            // Generate a pluralized endpoint base name (simplified)
            // User -> users, ProductVariant -> productvariants
            const endpointName = modelName.toLowerCase() + 's';

            const module = await import(`file://${path.join(modelsDir, file)}`);
            const Model = module.default;

            if (Model && Model.modelName) {
                const modelRouter = express.Router();

                // Generate standardized CRUD endpoints for this specific model
                modelRouter.post('/', createItem(Model));
                modelRouter.get('/', getItems(Model));
                modelRouter.get('/:id', getItemById(Model));
                modelRouter.put('/:id', updateItem(Model));
                modelRouter.delete('/:id', deleteItem(Model));

                // Mount it to the main router
                app.use(`/api/v1/${endpointName}`, modelRouter);
                console.log(`[Dynamic Router] Mount: /api/v1/${endpointName} -> CRUD -> ${modelName}`);
            }
        } catch (error) {
            console.error(`[Dynamic Router] Failed to load module ${file}:`, error.message);
        }
    }
};

export default mountDynamicRoutes;
