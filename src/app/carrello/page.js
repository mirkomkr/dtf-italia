import CartPage from "@/components/cart/CartPage";
import Breadcrumb from "@/components/common/Breadcrumb";
import { BREADCRUMB_ITEMS } from "@/lib/breadcrumb-config";

export const metadata = {
  title: "Carrello",
  description: "Rivedi i tuoi ordini e procedi al pagamento.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 pt-20 pb-2">
        <Breadcrumb items={BREADCRUMB_ITEMS["/carrello"]} />
      </div>
      <CartPage />
    </>
  );
}
