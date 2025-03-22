import RegisterPage from "@/app/(auth)/register/page";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterAuth } from "@/types/schema/auth";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DialogCreateUser({ children }: { children: ReactNode }) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = useForm<RegisterAuth>({
    defaultValues: {
      name: "",
      username: "",
      password: ""
    }
  });
  const queryClient = useQueryClient()
  const {mutate, isPending} = trpc.member.add.useMutation({
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: ['member','findAll']})
        toast.success(response.message)
        reset()
      } else {
        toast.error(response.message)
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user")
    }
  })


const onSubmit =  (data: RegisterAuth) => {
    mutate(data)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter username"
              {...register("username", { required: "Username is required" })}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create password"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting  || isPending}
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}