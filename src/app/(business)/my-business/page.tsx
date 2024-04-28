import { getMyBusiness } from "@/queries/getMyBusiness";
import { useQuery } from "@tanstack/react-query";

export default async function MyBusinessPage() {
  const { data } = useQuery({
    queryKey: ["my-business"],
    queryFn: getMyBusiness,
  });
  console.log(data);

  return <>MyBusiness</>;
}
