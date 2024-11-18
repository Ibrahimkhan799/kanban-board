"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useBoardStore } from "@/lib/store";
import SettingsLoading from "./loading";
import { useRouter } from "next/navigation";
import { deleteUser, getUser } from "@/lib/auth";
import { ThemeColorRadio } from "@/components/theme-color-radio";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const { user_id, clearBoards, isLoading } = useBoardStore();
  const [user, setUser] = useState({
    created_at: 0,
    id: user_id as string,
    email: "user@example.com",
    name: "user",
  });
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user_id) return;
        const userData = await getUser(user_id);
        setUser((prev) => ({
          ...prev,
          email: userData.email,
          name: userData.name,
          created_at: userData.created_at,
        }));
      } catch (error) {
        console.error("Failed to load user:", error);
        router.push("/login");
      }
    };

    if (user_id) {
      loadUser();
    }
  }, [user_id, router]);

  if (!mounted || isLoading) {
    return <SettingsLoading />;
  }

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearBoards();
      toast({
        title: "Success",
        description: "Boards cache cleared successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear boards cache",
      });
      console.error("Failed to clear boards cache:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      document.cookie =
        "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      await deleteUser(user_id as string);
      setTimeout(() => {
        router.push("/login");
      }, 300);
    } catch (error) {
      setIsDeleting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      });
    }
  };

  const handleLogout = () => {
    setIsLogging(true);
    document.cookie = "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("color-theme");
    setTimeout(() => {
      router.push("/login");
    }, 300);
  };

  const AppearanceSection = (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Appearance</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="theme">Theme Mode</Label>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme mode
            </p>
          </div>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="w-full justify-between flex flex-row gap-4">
          <div>
            <Label>Color Theme</Label>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
          <ThemeColorRadio />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and account settings
        </p>
      </div>

      <Separator />

      {AppearanceSection}

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important updates
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications for real-time updates
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Data Management</h2>
        <div className="flex flex-col gap-4">
          <div className="space-y-4 flex flex-row gap-3 justify-between w-full">
            <div className="flex flex-col gap-2">
              <Label>Clear Local Data</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Clear all locally stored board data. This action cannot be
                undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleClearCache}
              disabled={isClearing}
            >
              {isClearing ? "Clearing..." : "Clear Boards Cache"}
            </Button>
          </div>
          <div className="flex flex-row gap-3 justify-between items-center w-full">
            <div className="flex flex-col gap-2">
              <Label>Delete User Data</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Delete all the user data containing the user info and boards.
                This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete My Data"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Separator />
          <div>
            <Label>Account Type</Label>
            <p className="text-sm text-muted-foreground">Free Plan</p>
          </div>
          <Separator />
          <div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLogging}
            >
              {isLogging ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
