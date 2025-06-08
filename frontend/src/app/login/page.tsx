import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Wealth One.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm type="login" />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://images.pexels.com/photos/7681676/pexels-photo-7681676.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
}
