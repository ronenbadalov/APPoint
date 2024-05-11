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
import { updateMyBusiness } from "@/mutations";
import { BusinessData } from "@/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import { debounce } from "lodash";
import { EditIcon, LoaderCircle, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import * as z from "zod";
import { ServiceModal } from "./ServiceModal";
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
  serviceId: z.string().optional(),
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
  imageUrl: z.any().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type ServiceModalFormData = z.infer<typeof serviceObj>;

export type MyBusinessFormData = z.infer<typeof FormSchema>;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const serviceDefaultValues: ServiceModalFormData = {
  name: "",
  description: "",
  duration: 0,
  price: 0,
};

interface BusinessPageProps {
  businessData: BusinessData;
  isLoading: boolean;
  refetch?: () => void;
}

export const BusinessPage = ({
  businessData,
  isLoading,
  refetch,
}: BusinessPageProps) => {
  const { data: session } = useSession();
  const isBusinessOwner =
    session?.user?.role === Role.BUSINESS &&
    session?.user?.id === businessData?.userId;
  const [isEditing, setIsEditing] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { mutate: updateMyBusinessMutation, isPending } = useMutation({
    mutationFn: updateMyBusiness,
    onSuccess: () => {
      refetch?.();
      form.reset();
    },
  });

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

  const provider = useMemo(() => new OpenStreetMapProvider(), []);
  const debouncedFetchData = useCallback(
    debounce(async (q: string) => {
      const data = await provider.search({ query: q });
      if (data[0]) {
        form.setValue("longitude", data[0].x);
        form.setValue("latitude", data[0].y);
      }
    }, 300),
    [provider]
  );

  const workingHours = form.watch("workingHours");
  const imageFile = form.watch("imageUrl");
  const {
    fields: servicesFields,
    replace,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const onSubmit = async (data: MyBusinessFormData) => {
    try {
      const dataWithServicesId: MyBusinessFormData = {
        ...data,
        services: data.services?.map((s) => ({
          ...s,
          id: s.serviceId,
          serviceId: undefined,
        })),
      };
      await updateMyBusinessMutation(dataWithServicesId);
      setIsEditing(false);
    } catch (error: any) {}
  };

  // service modal form
  const serviceModalForm = useForm<ServiceModalFormData>({
    resolver: zodResolver(serviceObj),
    defaultValues: serviceDefaultValues,
  });

  const openServiceModal = () => {
    serviceModalForm.reset(serviceDefaultValues);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setTimeout(() => serviceModalForm.reset(serviceDefaultValues), 100);
  };

  const onSubmitServiceModal = async (data: ServiceModalFormData) => {
    try {
      if (data.serviceId) {
        const index = servicesFields.findIndex(
          (service) => service.serviceId === data.serviceId
        );
        update(index, data);
      } else {
        append(data);
      }
      closeServiceModal();
    } catch (error: any) {}
  };

  const onServiceEdit = (index: number) => {
    serviceModalForm.reset(servicesFields[index]);
    setIsServiceModalOpen(true);
  };

  const onServiceDelete = (index: number) => {
    remove(index);
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
      businessData.services.map(
        ({ duration, description, name, price, id }) => ({
          duration,
          description,
          name,
          price,
          serviceId: id,
        })
      )
    );
  }, [businessData, isEditing, form, replace]);

  const [imageSrc, setImageSrc] = useState<string | undefined>(); // initial src will be empty

  useEffect(() => {
    if (!imageFile) {
      setImageSrc(undefined);
      return;
    }
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    if (imageUrl) setImageSrc(imageUrl);
  }, [imageFile]);

  return isLoading || isPending ? (
    <div className=" flex justify-center items-center mt-64">
      <LoaderCircle className="animate-spin" size={32} />
    </div>
  ) : (
    <div>
      <Form {...form}>
        <form className="space-y-4">
          <div className="py-5 flex flex-col max-w-screen-lg m-auto gap-5">
            <div className="flex w-full items-center gap-5">
              <div className="flex gap-5 items-center w-full">
                <div className="w-28 h-28 rounded-full relative border-2 border-primary">
                  {(imageSrc || businessData?.imageUrl) && (
                    <Image
                      src={imageSrc || businessData?.imageUrl || ""}
                      alt="logo"
                      className="object-cover rounded-full w-28 h-28"
                      layout="fill"
                    />
                  )}
                  {isEditing && (
                    <div className="absolute right-0 bottom-0">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <input
                                  // @ts-ignore
                                  type="file"
                                  {...fieldProps}
                                  hidden
                                  ref={ref}
                                  onChange={async (e) => {
                                    if (!e.target.files || !e.target.files[0])
                                      return;
                                    onChange(e.target.files[0]);
                                    if (ref.current) {
                                      ref.current.value = "";
                                    }
                                  }}
                                  accept="image/*"
                                />
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => ref.current?.click()}
                                >
                                  <EditIcon size={14} />
                                </Button>
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
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
              {isBusinessOwner && !isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <EditIcon size={14} className="mr-2" />
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
                              <Input
                                {...field}
                                onChange={(e) => {
                                  debouncedFetchData(e.target.value);
                                  field.onChange(e);
                                }}
                              />
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
                      <div className="flex gap-2">
                        <p>{businessData.address}</p>
                        <Link
                          href={`https://www.google.com/maps?saddr=My+Location&daddr=${businessData.address}`}
                          target="_blank"
                          passHref
                        >
                          <img
                            src="/static/google-maps.png"
                            alt="google-maps"
                            className="w-6 h-6 cursor-pointer"
                          />
                        </Link>
                        <Link
                          href={`https://www.waze.com/ul?ll=${businessData.latitude},${businessData.longitude}&navigate=yes`}
                          passHref
                          target="_blank"
                        >
                          <img
                            src="/static/waze.svg"
                            alt="waze"
                            className="w-6 h-6 cursor-pointer"
                          />
                        </Link>
                      </div>
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
                        servicesFields.map((field, i) => (
                          <ServiceCard
                            key={field.id}
                            {...field}
                            onEdit={() => onServiceEdit(i)}
                            onDelete={() => onServiceDelete(i)}
                          />
                        ))
                      ) : businessData?.services.length ? (
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
                          className="w-[270px] min-h-[134px] pointer flex items-center justify-center"
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
            {isEditing && (
              <div className="w-full flex justify-end gap-3 mt-3">
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
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  Save
                </Button>
              </div>
            )}
            {businessData?.latitude && businessData?.longitude && (
              <MapContainer
                center={[businessData.latitude, businessData.longitude]}
                zoom={18}
                minZoom={10}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                  position={[businessData.latitude, businessData.longitude]}
                />
              </MapContainer>
            )}
          </div>
        </form>
      </Form>
      <Dialog open={isServiceModalOpen} onOpenChange={closeServiceModal}>
        <Form {...serviceModalForm}>
          <form>
            <ServiceModal onSubmit={onSubmitServiceModal} />
          </form>
        </Form>
      </Dialog>
    </div>
  );
};
