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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ServiceModalFormData } from "../page";

interface NewServiceModalProps {
  onSubmit: (data: ServiceModalFormData) => Promise<void>;
}

export const NewServiceModal = ({ onSubmit }: NewServiceModalProps) => {
  const { control, handleSubmit } = useFormContext<ServiceModalFormData>();
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create a Service</DialogTitle>
        <DialogDescription>
          create a service for your business
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Service Name" {...field} />
              </FormControl>
              {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
        <FormField
          control={control}
          name="price"
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Price"
                  {...field}
                  onChange={(e) => {
                    e.preventDefault();
                    if (isNaN(e.target.valueAsNumber)) {
                      field.onChange(0);
                      return;
                    }
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              {errors.price && (
                <FormMessage>{errors.price.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="duration"
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duration"
                  {...field}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              {errors.duration && (
                <FormMessage>{errors.duration.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button type="button" onClick={handleSubmit(onSubmit)}>
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
