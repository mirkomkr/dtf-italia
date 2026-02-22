import CartPage from "@/components/cart/CartPage";

export const metadata = {
  title: "Carrello",
  description: "Rivedi i tuoi ordini e procedi al pagamento.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartPage />;
}
