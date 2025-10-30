import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginAccount } from "./useLogin";
import { loginSchema } from "./loginSchema";
import { Spinner } from "@/components/ui/spinner";
import { KeyRound } from "lucide-react";

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const { mutate: loginAccount, isPending } = useLoginAccount();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    loginAccount(formData, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const handleCredentialSelect = (username: string, password: string) => {
    form.setValue("username", username);
    form.setValue("password", password);
    
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 100);
  };

  return (
    <div className="bg-[#fff] w-full h-[100dvh] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-4 left-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <KeyRound className="h-4 w-4" />
              Test Credentials
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Select Test Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleCredentialSelect("admin", "admin")}
              className="cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">Admin Account</span>
                <span className="text-xs text-muted-foreground">
                  Username: admin
                </span>
                <span className="text-xs text-muted-foreground">
                  Password: admin
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleCredentialSelect("FieldAgent", "FieldAgent")}
              className="cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">Field Agent</span>
                <span className="text-xs text-muted-foreground">
                  Username: FieldAgent
                </span>
                <span className="text-xs text-muted-foreground">
                  Password: FieldAgent
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleCredentialSelect("CustomerAgent", "CustomerAgent")}
              className="cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">Customer Agent</span>
                <span className="text-xs text-muted-foreground">
                  Username: CustomerAgent
                </span>
                <span className="text-xs text-muted-foreground">
                  Password: CustomerAgent
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <span className="py-4 flex flex-col justify-center items-center">
        <h1>LOGO</h1>
        <p className="font-semibold">Log in to your account</p>
      </span>
      <Card className="w-full max-w-md">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        autoComplete="username"
                        placeholder="username..."
                        className="focus:ring-2 focus:!ring-blue-600/40 focus:!border-blue-600/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        disabled={isPending}
                        autoComplete="current-password"
                        placeholder="password..."
                        className="focus:ring-2 focus:!ring-blue-600/40 focus:!border-blue-600/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;