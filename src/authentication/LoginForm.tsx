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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginAccount } from "./useLogin";
import { loginSchema } from "./loginSchema"; 

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
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    loginAccount(formData, {
      onSuccess: () => {
        form.reset(); 
      },
    });
  }


  return (
    <div className="bg-[#fff] w-full h-[100dvh] flex flex-col justify-center items-center">
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
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;