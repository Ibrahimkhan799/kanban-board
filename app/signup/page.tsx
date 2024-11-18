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
import { createUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    document.title = "Create a new account";
  }, []);

  const handleSubmit = async () => {
    if (user.name.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid Name!",
        description: "Name must be greater than 6 characters.",
      });
      return;
    } else if (user.password.length < 8 || user.password.length > 20) {
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
      const res = await createUser(user);
      if (res.data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(res.data.session));
        document.cookie = `user_id=${res.data.user?.id}; path=/`;
      }
      toast({
        title: "Account created!",
        description: "You have successfully created your account.",
      });
      
      setTimeout(() => {
          router.push('/board');
      }, 300);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create account",
        description: error instanceof Error ? error.message : "Something went wrong",
        action : <ToastAction altText="Try Again">Try Again</ToastAction>
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              value={user.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
            />
          </div>
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
              id="password"
              value={user.password}
              onChange={handleChange}
              type="password"
              placeholder="Create a password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleSubmit} className="w-full">
            {!isLoading && <>Sign Up</>}
            {isLoading && (
              <>
                Creating...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
