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
  MoreHorizontal,
  Loader2
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
import useNotifications, { Notification } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { toast as sonnerToast } from "sonner";

const NotificationSystem = () => {
  const { user } = useAuth();
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case "booking_confirmed":
      case "booking_cancelled":
      case "booking_reminder": 
        return Calendar;
      case "message_received":
        return MessageSquare;
      case "review_received":
      case "review_response": 
        return Star;
      case "payment_received": 
        return DollarSign;
      case "business_approved": return CheckCircle;
      case "system_announcement": return Info;
      case "marketing_alert": return Heart;
      default: 
        console.warn('Unknown notification type for icon:', type);
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case "booking_confirmed": return "text-blue-600 bg-blue-100";
      case "booking_cancelled": return "text-red-600 bg-red-100";
      case "booking_reminder": return "text-orange-600 bg-orange-100";
      case "review_received":
      case "review_response": 
        return "text-yellow-600 bg-yellow-100";
      case "payment_received": return "text-emerald-600 bg-emerald-100";
      case "business_approved": return "text-green-600 bg-green-100";
      case "system_announcement": return "text-gray-600 bg-gray-100";
      case "marketing_alert": return "text-pink-600 bg-pink-100";
      default: 
        console.warn('Unknown notification type for color:', type);
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (!notification) return false;
    switch (filter) {
      case "unread": return !notification.is_read;
      case "important": return notification.data && (notification.data as any).isImportant === true;
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => n && !n.is_read).length;
  const importantCount = notifications.filter(n => n && !n.is_read && n.data && (n.data as any).isImportant === true).length;

  const formatTimestamp = (timestampString: string | null | undefined) => {
    if (!timestampString) return '';
    const timestamp = new Date(timestampString);
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'just now';
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  if (!user) {
    return null;
  }

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
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button variant="link" size="sm" onClick={() => markAllAsRead()} className="p-1 text-xs">
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => fetchNotifications()} className="h-7 w-7">
                 <Loader2 className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className="flex-1"
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === "important" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("important")}
              className="flex-1"
            >
              Important ({importantCount})
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-6 text-center flex flex-col items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground text-sm">Loading notifications...</p>
            </div>
          )}
          {!loading && error && (
            <div className="p-6 text-center flex flex-col items-center justify-center h-32">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-muted-foreground text-sm">Error loading notifications.</p>
              <Button variant="link" size="sm" onClick={() => fetchNotifications()} className="mt-2">
                Try again
              </Button>
            </div>
          )}
          {!loading && !error && filteredNotifications.length === 0 && (
            <div className="p-6 text-center flex flex-col items-center justify-center h-32">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
              <p className="text-muted-foreground text-sm">
                {filter === "unread" ? "No unread notifications" : 
                 filter === "important" ? "No important notifications" : 
                 "You're all caught up!"}
              </p>
            </div>
          )}
          {!loading && !error && filteredNotifications.length > 0 && (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => {
                if (!notification) return null;
                const IconComponent = getNotificationIcon(notification.type);
                const colorClasses = getNotificationColor(notification.type);
                const actionUrl = (notification.data as any)?.actionUrl || notification.message;
                const isClickable = !!(notification.data as any)?.actionUrl;

                return (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-muted/50 transition-colors ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-full ${colorClasses} flex-shrink-0`}>
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-medium text-sm leading-tight ${!notification.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </p>
                            
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-normal mt-0.5">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-1.5">
                              {(notification.data as any)?.businessName && (
                                <span className="text-xs text-muted-foreground">
                                  {(notification.data as any).businessName}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.created_at)}
                              </span>
                              {notification.data && (notification.data as any).isImportant === true && (
                                <Badge variant="outline" className="text-xs border-red-500 text-red-500 py-0 px-1.5">
                                  Important
                                </Badge>
                              )}
                              {!notification.is_read && (
                                <div className="w-1.5 h-1.5 bg-primary rounded-full ml-auto mr-1"></div>
                              )}
                            </div>
                             {isClickable && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 h-auto text-xs mt-1 text-primary hover:underline"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    sonnerToast.info(`Navigating to: ${actionUrl}`)
                                  }}
                                >
                                  View Details
                                </Button>
                              )}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {!notification.is_read && (
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}>
                                  <CheckCircle className="mr-2 h-3.5 w-3.5" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-500 hover:!text-red-500 focus:!text-red-500"
                              >
                                <X className="mr-2 h-3.5 w-3.5" />
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

        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-primary" asChild>
              <span onClick={() => sonnerToast.info('Navigate to full notifications page (TODO)')}>
                View All Notifications
              </span>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSystem; 