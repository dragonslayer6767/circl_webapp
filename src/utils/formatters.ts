/**
 * Convert ISO date string to relative time format (e.g., "2 hours ago")
 * Matches iOS timeAgo() function logic
 */
export function timeAgo(dateString: string): string {
  try {
    const postDate = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const week = 604800;
    const month = 2592000;
    const year = 31536000;

    if (secondsAgo < 10) {
      return 'Just now';
    } else if (secondsAgo < minute) {
      return `${secondsAgo} sec${secondsAgo > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < hour) {
      const mins = Math.floor(secondsAgo / minute);
      return `${mins} min ago`;
    } else if (secondsAgo < day) {
      const hours = Math.floor(secondsAgo / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < week) {
      const days = Math.floor(secondsAgo / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < month) {
      const weeks = Math.floor(secondsAgo / week);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < year) {
      const months = Math.floor(secondsAgo / month);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(secondsAgo / year);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    return 'Just now';
  }
}

/**
 * Format date to readable string (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}
