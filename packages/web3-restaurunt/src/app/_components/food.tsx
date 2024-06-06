import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FoodBuy } from "./food-buy";

interface FoodProps {
  foodId: number;
  name: string;
  price: number;
  image: string;
  className?: string;
}

export function Food({ foodId, name, price, image, className }: FoodProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={image} alt={name} width={400} height={400} />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="font-bold">{price.toString()}$ Ether</div>
        <FoodBuy foodPrice={price}  foodId={foodId} />
      </CardFooter>
    </Card>
  );
}
