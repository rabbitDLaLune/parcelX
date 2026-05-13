import { Component } from '@angular/core';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'Parcel' | 'Driver' | 'System' | 'Delivery';
  isRead: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
})
export class Notifications {
  notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Parcel Out for Delivery',
      message: 'PXL202605120001 is now out for delivery with Daniel Tan.',
      type: 'Delivery',
      isRead: false,
      createdAt: '13 May 2026, 9:10 AM',
    },
    {
      id: 2,
      title: 'Parcel Delivered',
      message: 'PXL202605120003 has been delivered successfully.',
      type: 'Parcel',
      isRead: false,
      createdAt: '13 May 2026, 1:40 PM',
    },
    {
      id: 3,
      title: 'Driver Status Updated',
      message: 'Ravi Kumar is now available for new assignments.',
      type: 'Driver',
      isRead: true,
      createdAt: '13 May 2026, 2:15 PM',
    },
    {
      id: 4,
      title: 'System Reminder',
      message: 'Daily parcel report is ready for review.',
      type: 'System',
      isRead: true,
      createdAt: '13 May 2026, 6:00 PM',
    },
  ];

  get unreadCount(): number {
    return this.notifications.filter((item) => !item.isRead).length;
  }

  markAllRead(): void {
    this.notifications = this.notifications.map((item) => ({
      ...item,
      isRead: true,
    }));
  }

  getTypeStyle(type: NotificationItem['type']): string {
    if (type === 'Delivery') return 'bg-orange-100 text-orange-700';
    if (type === 'Parcel') return 'bg-red-100 text-red-700';
    if (type === 'Driver') return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-700';
  }
}
