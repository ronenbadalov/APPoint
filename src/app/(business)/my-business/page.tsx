"use client";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateMyBusiness } from "@/mutations";
import { getMyBusiness } from "@/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessDetails, Service, WorkingHours } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { LoaderCircle, Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { NewServiceModal } from "./NewServiceModal";
import { TimePicker } from "./TimePicker";

export const serviceObj = z.object({
  name: z.string().min(1, {
    message: "Service name is too short.",
  }),
  price: z.number().gt(0, {
    message: "Price must be greater than 0.",
  }),
  duration: z.number().gt(0, {
    message: "Duration must be greater than 0.",
  }),
  description: z.string().optional(),
});

const FormSchema = z.object({
  businessName: z.string().min(3, {
    message: "Business name too short.",
  }),
  address: z.string().min(3, {
    message: "Address too short.",
  }),
  phone: z.string().min(9, {
    message: "Phone number must be at least 9 characters.",
  }),
  workingHours: z.array(
    z.object({
      day: z.number(),
      isClosed: z.boolean().nullable(),
      startTime: z.date().nullable(),
      endTime: z.date().nullable(),
    })
  ),
  description: z.string().nullable(),
  services: z.array(serviceObj),
});

export type ServiceModalFormData = z.infer<typeof serviceObj>;

export type MyBusinessFormData = z.infer<typeof FormSchema>;

type BusinessData =
  | (BusinessDetails & { workingHours: WorkingHours[]; services: Service[] })
  | undefined;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function MyBusinessPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-business"],
    queryFn: getMyBusiness,
  });
  const { mutate: updateMyBusinessMutation } = useMutation({
    mutationFn: updateMyBusiness,
    onSuccess: () => {
      refetch();
    },
  });
  const { toast } = useToast();
  const businessData: BusinessData = useMemo(() => response?.data, [response]);

  const form = useForm<MyBusinessFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessName: "",
      address: "",
      phone: "",
      workingHours: [],
      description: "",
      services: [],
    },
  });

  const workingHours = form.watch("workingHours");

  const {
    fields: servicesFields,
    replace,
    append,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const onSubmit = async (data: MyBusinessFormData) => {
    try {
      await updateMyBusinessMutation(data);
      setIsEditing(false);
    } catch (error: any) {}
  };

  // service modal form
  const serviceModalForm = useForm<ServiceModalFormData>({
    resolver: zodResolver(serviceObj),
    defaultValues: {
      name: "",
      description: "",
      duration: 0,
      price: 0,
    },
  });

  console.log(form.formState.errors);

  const openServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
  };

  const onSubmitServiceModal = async (data: ServiceModalFormData) => {
    try {
      append(data);
      serviceModalForm.reset();
      closeServiceModal();
    } catch (error: any) {}
  };

  useEffect(() => {
    if (!businessData || !isEditing) return;
    form.setValue("businessName", businessData.businessName);
    form.setValue("address", businessData.address);
    form.setValue("phone", businessData.phone);
    form.setValue(
      "workingHours",
      businessData.workingHours.map((wh) => ({
        day: wh.day,
        isClosed: wh.isClosed,
        startTime: wh.startTime ? new Date(wh.startTime) : null,
        endTime: wh.endTime ? new Date(wh.endTime) : null,
      }))
    );
    form.setValue("description", businessData.description);
    replace(
      businessData.services.map(({ duration, description, name, price }) => ({
        duration,
        description,
        name,
        price,
      }))
    );
  }, [businessData, isEditing, form, replace]);

  return isLoading ? (
    <div className=" flex justify-center items-center mt-64">
      <LoaderCircle className="animate-spin" size={32} />
    </div>
  ) : (
    <div>
      <Form {...form}>
        <form className="space-y-4">
          <div className="py-5 flex flex-col max-w-screen-lg m-auto">
            <div className="flex w-full items-center gap-5">
              <div className="flex gap-5 items-center w-full">
                <div className="rounded-full bg-gray-200 w-28 h-28 flex justify-center items-center">
                  {/* <img src={businessData?.logo} alt="logo" /> */}
                </div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="businessName"
                    data-lpignore
                    render={({ field, formState: { errors } }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-full text-2xl font-bold h-12"
                            placeholder="Business Name"
                            {...field}
                          />
                        </FormControl>
                        {errors.businessName && (
                          <FormMessage>
                            {errors.businessName.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                ) : (
                  <h1 className="ml-4 text-2xl font-bold">
                    {businessData?.businessName}
                  </h1>
                )}
              </div>
              {!isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <Pencil size={14} className="mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <Separator className="my-5" />
            <table>
              <tbody className="flex flex-col gap-3">
                <tr className="flex gap-5">
                  <td className="w-36">
                    <p className="text-muted-foreground font-semibold">
                      Description
                    </p>
                  </td>
                  <td className=" w-full">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="description"
                        data-lpignore
                        render={({ field, formState: { errors } }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your business"
                                rows={5}
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ) : businessData?.description ? (
                      <p className="">{businessData.description}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No description provided
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="flex gap-5">
                  <td className="w-36">
                    <p className="text-muted-foreground font-semibold">
                      Address
                    </p>
                  </td>
                  <td className=" w-full">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="address"
                        data-lpignore
                        render={({ field, formState: { errors } }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            {errors.address && (
                              <FormMessage>
                                {errors.address.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    ) : businessData?.address ? (
                      <p className="">{businessData.address}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No address provided
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="flex gap-5">
                  <td className="w-36">
                    <p className="text-muted-foreground font-semibold">Phone</p>
                  </td>
                  <td className=" w-full">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="phone"
                        data-lpignore
                        render={({ field, formState: { errors } }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} ref={null} />
                            </FormControl>
                            {errors.phone && (
                              <FormMessage>{errors.phone.message}</FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    ) : businessData?.phone ? (
                      <p className="">{businessData?.phone}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No phone provided
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="flex gap-5">
                  <td className="w-36">
                    <p className="text-muted-foreground font-semibold whitespace-nowrap	">
                      Working Hours
                    </p>
                  </td>
                  <td className=" w-full">
                    <table>
                      <tbody>
                        {days.map((day, index) => {
                          const workingHour = businessData?.workingHours.find(
                            (wh) => wh.day === index + 1
                          );
                          const isClosed = workingHour?.isClosed;
                          const startTime = workingHour?.startTime
                            ? format(workingHour.startTime, "HH:mm")
                            : undefined;
                          const endTime = workingHour?.endTime
                            ? format(workingHour.endTime, "HH:mm")
                            : undefined;
                          return (
                            <tr
                              key={index}
                              className="flex items-center gap-2 pb-3"
                            >
                              <td className="w-36">
                                <p className="text-muted-foreground">{day}</p>
                              </td>
                              <td className="w-full">
                                {isEditing ? (
                                  <div className="flex align-center gap-3">
                                    <FormField
                                      control={form.control}
                                      name={`workingHours.${index}.startTime`}
                                      render={({ field }) => (
                                        <TimePicker
                                          date={field.value ?? undefined}
                                          setDate={field.onChange}
                                          disabled={
                                            !!workingHours[index]?.isClosed
                                          }
                                        />
                                      )}
                                    />
                                    <div className="pt-6">-</div>
                                    <FormField
                                      control={form.control}
                                      name={`workingHours.${index}.endTime`}
                                      render={({ field }) => (
                                        <TimePicker
                                          date={field.value ?? undefined}
                                          setDate={field.onChange}
                                          disabled={
                                            !!workingHours[index]?.isClosed
                                          }
                                        />
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`workingHours.${index}.isClosed`}
                                      render={({ field }) => (
                                        <FormItem className="space-y-0 flex gap-2 pt-[1.9rem]">
                                          <FormControl>
                                            <Checkbox
                                              checked={!!field.value}
                                              onCheckedChange={field.onChange}
                                            />
                                          </FormControl>
                                          <FormLabel>Closed</FormLabel>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                ) : isClosed ? (
                                  <p className="text-muted-foreground italic">
                                    Closed
                                  </p>
                                ) : workingHour ? (
                                  <p>
                                    {startTime} - {endTime}
                                  </p>
                                ) : (
                                  <p className="text-muted-foreground italic">
                                    Not provided
                                  </p>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr className="flex gap-5">
                  <td className="w-36">
                    <p className="text-muted-foreground font-semibold">
                      Services
                    </p>
                  </td>
                  <td className=" w-full">
                    <div className="grid gap-5 grid-cols-3">
                      {isEditing ? (
                        servicesFields.map((field) => (
                          <ServiceCard key={field.id} {...field} />
                        ))
                      ) : businessData?.services.length ? (
                        // RONEN-TODO: add edit & delete functionality
                        businessData.services.map((service) => (
                          <ServiceCard key={service.id} {...service} />
                        ))
                      ) : (
                        <p className="text-muted-foreground italic">
                          No services provided
                        </p>
                      )}
                      {isEditing && (
                        <Card
                          className="w-[270px] pointer flex items-center justify-center"
                          onClick={openServiceModal}
                        >
                          <div className="flex gap-1">
                            <Plus size={24} />
                            <h2 className="text-xl font-bold">
                              Add New Service
                            </h2>
                          </div>
                        </Card>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {isEditing && (
            <div className="fixed bottom-5 right-48 flex gap-3">
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  console.log("click");
                  form.handleSubmit(onSubmit)();
                }}
              >
                Save
              </Button>
            </div>
          )}
        </form>
      </Form>
      <Dialog open={isServiceModalOpen} onOpenChange={closeServiceModal}>
        <Form {...serviceModalForm}>
          <form>
            <NewServiceModal onSubmit={onSubmitServiceModal} />
          </form>
        </Form>
      </Dialog>
    </div>
  );
}
