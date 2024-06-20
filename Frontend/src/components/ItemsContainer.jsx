import Item from "./item";
import { PRODUCTS, RESOURCES, COMPANY, SUPPORT } from "./Menus";
const ItemsContainer = () => {
  return (
    <div className="flex py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-60 ml-35 mr-35 mx-auto">
        <Item Links={PRODUCTS} title="PRODUCTS" />
        <Item Links={RESOURCES} title="RESOURCES" />
        <Item Links={COMPANY} title="COMPANY" />
        <Item Links={SUPPORT} title="SUPPORT" />
      </div>
    </div>
  );
};

export default ItemsContainer;
