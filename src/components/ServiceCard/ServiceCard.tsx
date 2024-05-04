"use client";

import { FormServiceInput } from "@/app/(business)/my-business/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Hourglass } from "lucide-react";
export const ServiceCard = ({
  name,
  price,
  duration,
  description,
}: FormServiceInput) => {
  return (
    <Card className="w-[270px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
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
