import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        change_type: {
            type: String,
            required: true, // e.g. INSERT, UPDATE, DELETE
        },
        table_name: {
            type: String,
            required: true,
        },
        record_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
