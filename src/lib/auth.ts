import prisma from "@/lib/prisma";
import { Role, User } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}

export const handleNewUserDetails = async (newUser: User) => {
  if (newUser.role === Role.BUSINESS) {
    const businessDetails = await prisma.businessDetails.create({
      data: {
        userId: newUser.id,
        address: "",
        businessName: `${newUser.name}'s Business`,
        description: "",
        phone: "",
      },
    });

    const promiseArr = [];
    promiseArr.push(
      prisma.service.create({
        data: {
          description: "Default Service",
          duration: 30,
          name: "Default Service",
          price: 100,
          businessId: businessDetails.id,
        },
      })
    );
    promiseArr.push(
      prisma.workingHours.createMany({
        data: [
          {
            day: 1, // Sunday
            startTime: new Date("2022-01-01T09:00:00Z"),
            endTime: new Date("2022-01-01T17:00:00Z"),
            businessId: businessDetails.id,
          },
          {
            day: 2,
            startTime: new Date("2022-01-01T09:00:00Z"),
            endTime: new Date("2022-01-01T17:00:00Z"),
            businessId: businessDetails.id,
          },
          {
            day: 3,
            startTime: new Date("2022-01-01T09:00:00Z"),
            endTime: new Date("2022-01-01T17:00:00Z"),
            businessId: businessDetails.id,
          },
          {
            day: 4,
            startTime: new Date("2022-01-01T09:00:00Z"),
            endTime: new Date("2022-01-01T17:00:00Z"),
            businessId: businessDetails.id,
          },
          {
            day: 5,
            startTime: new Date("2022-01-01T09:00:00Z"),
            endTime: new Date("2022-01-01T17:00:00Z"),
            businessId: businessDetails.id,
          },
          {
            day: 6,
            startTime: new Date("2022-01-01T09:00:00Z"),
            endTime: new Date("2022-01-01T13:00:00Z"),
            businessId: businessDetails.id,
          },
          {
            day: 7,
            isClosed: true,
            businessId: businessDetails.id,
          },
        ],
      })
    );

    await Promise.all(promiseArr);
  } else if (newUser.role === Role.CUSTOMER) {
    await prisma.customerDetails.create({
      data: {
        userId: newUser.id,
      },
    });
  }
};
