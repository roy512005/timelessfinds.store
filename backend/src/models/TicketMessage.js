import mongoose from 'mongoose';

const ticketMessageSchema = new mongoose.Schema(
    {
        ticket_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SupportTicket',
            required: true,
        },
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Could be customer or staff
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const TicketMessage = mongoose.model('TicketMessage', ticketMessageSchema);
export default TicketMessage;
