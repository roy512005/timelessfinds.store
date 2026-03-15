import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
    {
        permission_name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Permission = mongoose.model('Permission', permissionSchema);
export default Permission;
