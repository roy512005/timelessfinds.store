import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'sent', 'failed'],
            default: 'draft',
        },
    },
    { timestamps: true } // Handles created_at
);

const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);
export default EmailCampaign;
