import { Suspense } from "react";
import Search from "@/components/Search";
import Spinner from "@/components/Spinner";

export default function SearchPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Search />
    </Suspense>
  );
}