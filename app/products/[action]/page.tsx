import Breadcrumb from "@/components/Navigation/Breadcrumb";
import ProductContainer from "@/components/Products/ProductContainer";

const ActionPage = ({
  params,
  searchParams,
}: {
  params: { action: string };
  searchParams?: { id: string };
}) => {
  const { action } = params;
  const id = searchParams?.id;
  const crumbs = [
    { title: "Products", link: "/products" },
    {
      title: `${action} Products`,
      link:
        action === "create" ? `/products/create` : `/products/edit?id=${id}`,
    },
  ];

  return (
    <main className="pt-5 pb-20 px-[3%] min-h-[100vh]">
      <Breadcrumb crumbs={crumbs} />
      <ProductContainer />
    </main>
  );
};

export default ActionPage;
