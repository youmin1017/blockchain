import { Coupon } from "./_components/coupon";
import { CouponForm } from "./_components/coupon-form";

export default async function AdminPage() {
  return (
    <div className="flex flex-col">
      <h1 className="m-2 text-3xl font-bold">Admin Page</h1>
      <div className="m-4 flex gap-2">
        <div className="flex flex-1 flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <Coupon tokenId={(i + 1).toString()} key={i} />
          ))}
        </div>
        <div className="flex-1">
          <CouponForm />
        </div>
      </div>
    </div>
  );
}
