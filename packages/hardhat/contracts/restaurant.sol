// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RestaurantCoupon} from "./restaurant-coupon.sol";

contract Restaurant is Ownable {
    RestaurantCoupon private coupon;

    struct Food {
        string name;
        uint256 price;
    }

    struct Seat {
        address customer;
        string food;
    }

    Seat[] public seats;
    Food[] public foods;

    constructor(address _couponAddress) Ownable(msg.sender) {
        coupon = RestaurantCoupon(_couponAddress);
        foods.push(Food("Pizza", 3000000000000000));
        foods.push(Food("Pasta", 4000000000000000));
        foods.push(Food("Salad", 5000000000000000));
        foods.push(Food("Steak", 10000000000000000));

        // Initialize seats
        for (uint i = 0; i < 30; i++) {
            seats.push(Seat(address(0), ""));
        }
    }

    function getAllFoodPrice() public view returns (Food[] memory) {
        return foods;
    }

    function getAllSeat() public view returns (Seat[] memory) {
        return seats;
    }

    function setFoodPrice(uint foodId, uint256 price) public onlyOwner {
        require(foodId < foods.length, "Invalid food id");
        foods[foodId].price = price;
    }

    function bookSeatWithCoupon(
        uint seatNumber,
        uint foodId,
        uint256 couponId
    ) public payable {
        require(seatNumber < 30, "Invalid seat number");
        require(seats[seatNumber].customer == address(0), "Seat is taken");
        require(msg.sender.balance > msg.value, "Insufficient balance");
        require(
            coupon.balanceOf(msg.sender, couponId) > 0,
            "Insufficient coupon"
        );

        coupon.useCoupon(couponId);

        uint256 price = foods[foodId].price;
        if (couponId == coupon.COUPON30()) {
            price = foods[foodId].price * 7 / 10;
        } else if (couponId == coupon.COUPON40()) {
            price = foods[foodId].price * 6 / 10;
        } else if (couponId == coupon.COUPON50()) {
            price = foods[foodId].price / 2;
        }

        require(msg.value >= price, "Insufficient value");
        payable(address(this)).transfer(price);

        seats[seatNumber] = Seat(msg.sender, foods[foodId].name);
    }

    function bookSeat(uint seatNumber, uint foodId) public payable {
        require(seatNumber < 30, "Invalid seat number");
        require(seats[seatNumber].customer == address(0), "Seat is taken");
        require(msg.sender.balance > msg.value, "Insufficient balance");
        require(msg.value >= foods[foodId].price, "Insufficient value");
        payable(address(this)).transfer(foods[foodId].price);
        seats[seatNumber] = Seat(msg.sender, foods[foodId].name);
    }

    function leaveSeat(uint seatNumber) public {
        require(seatNumber < 30, "Invalid seat number");
        require(seats[seatNumber].customer == msg.sender, "Not your seat");
        seats[seatNumber] = Seat(address(0), "");
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
