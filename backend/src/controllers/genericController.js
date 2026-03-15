import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generic CRUD operations
export const createItem = (Model) => async (req, res) => {
    try {
        const item = new Model(req.body);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getItems = (Model) => async (req, res) => {
    try {
        // basic pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const items = await Model.find({}).limit(limit).skip(skip);
        const total = await Model.countDocuments();

        res.json({ items, page, pages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getItemById = (Model) => async (req, res) => {
    try {
        const item = await Model.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateItem = (Model) => async (req, res) => {
    try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteItem = (Model) => async (req, res) => {
    try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (item) {
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
