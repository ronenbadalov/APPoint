import dynamic from "next/dynamic";

const MyBusinessForm = dynamic(() => import("./Form"), {
  ssr: false,
});

export default function MyBusinessPage() {
  return <MyBusinessForm />;
}
