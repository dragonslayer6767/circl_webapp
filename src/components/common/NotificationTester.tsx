import { useNotification } from '../../context/NotificationContext';
import { NotificationHelpers } from '../../utils/notificationHelpers';

export default function NotificationTester() {
  const { addNotification } = useNotification();

  const testNotifications = [
    // Message notifications with deep links to specific conversations
    NotificationHelpers.newMessage('user-001', 'Alex Martinez', 'Hey, let\'s connect!', 'conv-123'),
    NotificationHelpers.circleMessage('circle-tech', 'general', 'Tech Entrepreneurs', 'Sarah Chen', 'Check out this new framework!'),
    
    // Forum notifications with deep links to specific posts
    NotificationHelpers.postLiked('James Wilson', 'post-789', 'My startup journey'),
    NotificationHelpers.newComment('Emma Thompson', 'post-456', '10 tips for new entrepreneurs'),
    NotificationHelpers.commentReply('Michael Brown', 'post-234', 'Great advice!'),
    NotificationHelpers.mentioned('Lisa Garcia', 'post-567', 'forum'),
    
    // Network notifications with deep links to profiles
    NotificationHelpers.connectionRequest('user-002', 'David Kim'),
    NotificationHelpers.connectionAccepted('user-003', 'Jennifer Lee'),
    
    // Circle notifications with deep links to specific circles and events
    NotificationHelpers.circleInvite('circle-business', 'Business Leaders Network', 'Robert Chen'),
    NotificationHelpers.circleUpdate('circle-startups', 'Startup Founders', 'announcement'),
    NotificationHelpers.circleEvent('circle-tech', 'event-001', 'Networking Mixer', 'in 30 minutes'),
  ];

  const sendRandomNotification = () => {
    const random = testNotifications[Math.floor(Math.random() * testNotifications.length)];
    addNotification(random);
  };

  const sendAllNotifications = () => {
    testNotifications.forEach((notif, index) => {
      setTimeout(() => {
        addNotification(notif);
      }, index * 800);
    });
  };

  const sendMessageNotification = () => {
    const messageNotifs = testNotifications.filter(n => n.type === 'message');
    const random = messageNotifs[Math.floor(Math.random() * messageNotifs.length)];
    addNotification(random);
  };

  const sendNonMessageNotification = () => {
    const nonMessageNotifs = testNotifications.filter(n => n.type !== 'message');
    const random = nonMessageNotifs[Math.floor(Math.random() * nonMessageNotifs.length)];
    addNotification(random);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={sendRandomNotification}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        🎲 Test Random
      </button>
      <button
        onClick={sendMessageNotification}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
      >
        ✉️ Test Message
      </button>
      <button
        onClick={sendNonMessageNotification}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors font-medium text-sm"
      >
        🔔 Test Notification
      </button>
      <button
        onClick={sendAllNotifications}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors font-medium text-sm"
      >
        🚀 Test All
      </button>
    </div>
  );
}
