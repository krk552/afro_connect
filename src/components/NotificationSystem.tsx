import { useState, useEffect } from "react";
import { 
  Bell, 
  X, 
  Calendar, 
  MessageSquare, 
  Star, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "booking" | "message" | "review" | "payment" | "reminder" | "promotion" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  businessName?: string;
  businessImage?: string;
  metadata?: {
    bookingId?: string;
    amount?: number;
    rating?: number;
    serviceName?: string;
  };
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "booking",
        title: "Booking Confirmed",
        message: "Your appointment at Namibia Hair Studio has been confirmed for tomorrow at 10:00 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        isImportant: true,
        actionUrl: "/booking/123456",
        businessName: "Namibia Hair Studio",
        businessImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
        metadata: {
          bookingId: "123456",
          serviceName: "Women's Haircut"
        }
      },
      {
        id: "2",
        type: "reminder",
        title: "Appointment Reminder",
        message: "Don't forget your appointment at Desert Rose Spa in 2 hours",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        isImportant: true,
        actionUrl: "/booking/789012",
        businessName: "Desert Rose Spa",
        businessImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
        metadata: {
          bookingId: "789012",
          serviceName: "Relaxing Massage"
        }
      },
      {
        id: "3",
        type: "message",
        title: "New Message",
        message: "Kalahari Auto Care sent you a message about your upcoming service",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        isRead: true,
        isImportant: false,
        actionUrl: "/messages/345678",
        businessName: "Kalahari Auto Care",
        businessImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3"
      },
      {
        id: "4",
        type: "review",
        title: "Review Request",
        message: "How was your experience at Namibia Hair Studio? Leave a review to help others",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        isImportant: false,
        actionUrl: "/review/123456",
        businessName: "Namibia Hair Studio",
        businessImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
        metadata: {
          bookingId: "123456"
        }
      },
      {
        id: "5",
        type: "payment",
        title: "Payment Successful",
        message: "Your payment of N$250 for Women's Haircut has been processed",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        isRead: true,
        isImportant: false,
        actionUrl: "/payment/receipt/123456",
        businessName: "Namibia Hair Studio",
        metadata: {
          amount: 250,
          serviceName: "Women's Haircut"
        }
      },
      {
        id: "6",
        type: "promotion",
        title: "Special Offer",
        message: "Get 20% off your next booking at Desert Rose Spa. Limited time offer!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        isRead: false,
        isImportant: false,
        actionUrl: "/business/2",
        businessName: "Desert Rose Spa",
        businessImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
      },
      {
        id: "7",
        type: "system",
        title: "App Update Available",
        message: "A new version of Afro-Connect is available with improved features",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        isRead: true,
        isImportant: false,
        actionUrl: "/app-update"
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking": return Calendar;
      case "message": return MessageSquare;
      case "review": return Star;
      case "payment": return DollarSign;
      case "reminder": return Clock;
      case "promotion": return Heart;
      case "system": return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "booking": return "text-blue-600 bg-blue-100";
      case "message": return "text-green-600 bg-green-100";
      case "review": return "text-yellow-600 bg-yellow-100";
      case "payment": return "text-emerald-600 bg-emerald-100";
      case "reminder": return "text-orange-600 bg-orange-100";
      case "promotion": return "text-pink-600 bg-pink-100";
      case "system": return "text-gray-600 bg-gray-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated",
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case "unread": return !notification.isRead;
      case "important": return notification.isImportant;
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant && !n.isRead).length;

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === "important" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("important")}
            >
              Important ({importantCount})
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">
                {filter === "unread" ? "No unread notifications" : 
                 filter === "important" ? "No important notifications" : 
                 "No notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const colorClasses = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        // Navigate to action URL
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${colorClasses} flex-shrink-0`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-medium text-sm ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                {notification.title}
                              </p>
                              {notification.isImportant && (
                                <Badge variant="destructive" className="text-xs">
                                  Important
                                </Badge>
                              )}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              {notification.businessName && (
                                <div className="flex items-center gap-1">
                                  {notification.businessImage && (
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={notification.businessImage} />
                                      <AvatarFallback className="text-xs">
                                        {notification.businessName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {notification.businessName}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="border-t p-3">
            <Button variant="ghost" className="w-full text-sm" asChild>
              <a href="/notifications">
                View All Notifications
              </a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSystem; 