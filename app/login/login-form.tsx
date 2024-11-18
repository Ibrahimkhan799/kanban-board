"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { LoginUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleSubmit = async () => {
    if (user.password.length < 8 || user.password.length > 20) {
      toast({
        variant: "destructive",
        title: "Invalid password!",
        description:
          user.password.length < 8
            ? "Password must be greater than 8 characters."
            : "Password must be less than 20 characters.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await LoginUser(user);
      if (res) {
        if (res.session) {
          localStorage.setItem('supabase.auth.token', JSON.stringify(res.session));
          document.cookie = `user_id=${res.user?.id}; path=/`;
        }
        toast({
          title: "Successfully Login!",
          description: "You will be redirected to the dashboard shortly.",
        });
        router.push("/board");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Login!",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        action: <ToastAction altText="Try Again">Try Again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setUser((prev) => ({
      ...prev,
      [target.id]: target.value,
    }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              value={user.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              value={user.password}
              onChange={handleChange}
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleSubmit} className="w-full">
            {!isLoading && <>Login</>}
            {isLoading && (
              <>
                Logging in...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
