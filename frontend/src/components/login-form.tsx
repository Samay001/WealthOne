import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  type, // "login" or "register"
  className,
  ...props
}: {
  type: "login" | "register";
} & React.ComponentProps<"form">) {
  const isLogin = type === "login";

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isLogin ? "Login to your account" : "Create an account"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? "Enter your email below to login to your account"
            : "Enter your details below to create your account"}
        </p>
      </div>
      <div className="grid gap-6">
        {!isLogin && (
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
        )}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {isLogin && (
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            )}
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
        <div className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
          <a href={isLogin ? "/register" : "/login"} className="underline underline-offset-4">
            {isLogin ? "Sign up" : "Login"}
          </a>
        </div>
      </div>
    </form>
  );
}
