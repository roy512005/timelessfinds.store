import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.user_id.equals(req.user._id)) {
            notification.read_status = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
