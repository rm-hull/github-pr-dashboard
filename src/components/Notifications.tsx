import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import pluralize from "pluralize";
import { useCallback, useEffect, useRef } from "react";
import { toaster } from "./ui/toaster";

type NotificationsProps = {
  count?: number;
};

export function Notifications({ count = 0 }: NotificationsProps) {
    const prevCountRef = useRef(count);
    const { settings, updateSettings } = useGeneralSettings();
  
    console.log({
      count,
      prev: prevCountRef.current,
      notificationPermission: Notification.permission,
    });

    useEffect(() => {
      if (settings?.enableNotifications && Notification.permission === "granted" && count > prevCountRef.current) {
        const diff = count - prevCountRef.current;
        const verb = diff === 1 ? "is" : "are";
        const prWord = pluralize("PR", diff);
  
        new Notification(`GitHub PR Dashboard`, {
          body: `There ${verb} ${diff} new ${prWord}`,
          tag: `github-pr-dashboard`,
          icon: `${import.meta.env.BASE_URL}/favicon.ico`,
        });
      }
      prevCountRef.current = count;
    }, [settings?.enableNotifications, count, prevCountRef.current]);


      const enableNotifications = useCallback(async () => {
        if (settings?.enableNotifications && Notification.permission !== "granted") {
          const reason = await Notification.requestPermission();
          if (reason === "denied") {
            queueMicrotask(() =>
              toaster.create({
                title: "Notifications are disabled",
                description: `You have disabled notifications for this site. Please enable them in your browser settings to use this feature.`, // TODO: More descriptive message
                type: "warning",
                duration: 9000,
                closable: true,
              })
            );
            return await updateSettings({ ...settings, enableNotifications: false });
          } else if (reason === "granted") {
            queueMicrotask(() =>
              toaster.create({
                title: "Notifications enabled",
                description: "Notifications have been enabled for this site.",
                type: "success",
                duration: 5000,
                closable: true,
              })
            );
          }
        }
      }, [settings, updateSettings]);
    
      useEffect(() => void enableNotifications(), [enableNotifications]);

  return null;
}