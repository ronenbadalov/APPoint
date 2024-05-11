"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, EditIcon, Hourglass, Trash } from "lucide-react";
import { ServiceModalFormData } from "../BusinessPage";
import { Button } from "../ui/button";

interface ServiceCardProps extends ServiceModalFormData {
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ServiceCard = ({
  name,
  price,
  duration,
  description,
  onDelete,
  onEdit,
}: ServiceCardProps) => {
  return (
    <Card className="w-[270px]">
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle className="w-fit h-fit ">{name}</CardTitle>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                type="button"
                onClick={onEdit}
                className="w-6 h-6"
                size="icon"
              >
                <EditIcon size={14} />
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                onClick={onDelete}
                className="w-6 h-6"
                size="icon"
              >
                <Trash size={14} />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <table>
          <tbody>
            <tr className="flex gap-3">
              <td className="w-28 flex items-center text-muted-foreground text-sm">
                <Hourglass size={14} className="mr-2" />
                Duration:
              </td>
              <td className="text-sm">{duration} Minutes</td>
            </tr>
            <tr className="flex gap-3">
              <td className=" w-28 flex items-center text-muted-foreground text-sm">
                <CircleDollarSign size={14} className="mr-2" />
                Price:
              </td>
              <td className="text-sm">${price}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
