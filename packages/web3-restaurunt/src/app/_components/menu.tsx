import { ethers } from "ethers";
import { Coupon } from "../coupon/_components/coupon";
import { Food } from "./food";
import { Separator } from "@/components/ui/separator";

const FOODS = [
  // name: "Pizza,300,Pasta,400,Salad,500,Steak,1000"
  {
    id: 0,
    name: "Pizza",
    price: 0.003,
    image: "/pizza.jpeg",
  },
  {
    id: 1,
    name: "Pasta",
    price: 0.004,
    image: "/pasta.jpeg",
  },
  {
    id: 2,
    name: "Salad",
    price: 0.005,
    image: "/salad.jpeg",
  },
  {
    id: 3,
    name: "Steak",
    price: 0.01,
    image: "/steak.jpeg",
  },
];

export function Menu() {
  return (
    <div>
      <div className="text-2xl font-bold italic">Coupons</div>
      <div className="flex gap-2">
        <Coupon tokenId="1" />
        <Coupon tokenId="2" />
        <Coupon tokenId="3" />
      </div>
      <Separator className="my-4" />
      <div className="text-2xl font-bold italic">Menu</div>
      <div className="flex flex-wrap gap-2">
        {FOODS.map((food) => (
          <Food
            className="w-[49%]"
            key={food.name}
            foodId={food.id}
            name={food.name}
            price={food.price}
            image={food.image}
          />
        ))}
      </div>
    </div>
  );
}
