import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, UseFieldArrayAppend, useForm } from "react-hook-form";
import { z } from "zod";
import { serviceObj as FormSchema, MyBusinessFormData } from "../page";

interface NewServiceModalProps {
  onClose: () => void;
  addNewService: UseFieldArrayAppend<MyBusinessFormData, "services">;
}

interface Service {
  name: string;
  price: number;
  duration: number;
  description?: string;
}

type FormData = z.infer<typeof FormSchema>;

export const NewServiceModal = ({
  onClose,
  addNewService,
}: NewServiceModalProps) => {
  const form = useForm<Service>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 0,
      price: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      addNewService(data);
      onClose();
    } catch (error: any) {}
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create a Service</DialogTitle>
        <DialogDescription>
          create a service for your business
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Service Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Duration" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
