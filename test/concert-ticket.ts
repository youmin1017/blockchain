import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Concert ticket management system with ERC721", function () {
	async function deployConcertTicketFixture() {
		const [owner, account1, account2] = await ethers.getSigners();

		const ConcertTicket = await ethers.getContractFactory("ConcertTicket");
		const ticket = await ConcertTicket.deploy(owner, "ConcertTicket", "CT");

		await ticket.waitForDeployment();

		return { ticket, owner, account1, account2 };
	}

	describe("Deployment", function () {
		it("Should set the right owner when contract construct", async function () {
			const { ticket, owner } = await loadFixture(deployConcertTicketFixture);

			expect(await ticket.owner()).to.equal(owner);
		});
		it("Should be able to set concert information and get one", async function () {
			const { ticket } = await loadFixture(deployConcertTicketFixture);

			const initInfo = {
				title: "暨大星聚點",
				des: "在暨大大草原將舉辦大型演唱會!",
				date: "2024/6/6",
				place: "暨大大草原",
			};

			await ticket.initialConcertInfo(
				initInfo.title,
				initInfo.des,
				initInfo.date,
				initInfo.place
			);

			const concertInfo = await ticket.getConcertInfo();

			expect(concertInfo[0]).equal(initInfo.title);
			expect(concertInfo[1]).equal(initInfo.des);
			expect(concertInfo[2]).equal(initInfo.date);
			expect(concertInfo[3]).equal(initInfo.place);
		});
		it("Should be able to generate tickets and get tickets information", async function () {
			const { ticket, owner, account1 } = await loadFixture(
				deployConcertTicketFixture
			);

			await ticket.genAreaTickets(2, 50, 1, 100);
			await ticket.genTickets(2, 10, 2, 1000);

			const totalTicketAmount = 2 * 50 + 10;

			// 檢查管理員是否成功擁有剛剛生成的門票
			const managerBalance = await ticket.balanceOf(owner);
			const buyableTickets = await ticket.getBuyableTickets();
			const soldTickets = await ticket.getSoldTickets();
			const testOwnerOf = await ticket.ownerOf(buyableTickets[0]);

			expect(managerBalance).to.equal(totalTicketAmount);
			expect(buyableTickets.length).to.equal(totalTicketAmount);
			expect(soldTickets.length).to.equal(0);
			expect(testOwnerOf).to.equal(owner);
		});
		it("Should be able to buy ticket from manager", async function () {
			const { ticket, account1 } = await loadFixture(
				deployConcertTicketFixture
			);
			await ticket.genAreaTickets(2, 50, 1, 100);
			await ticket.genTickets(2, 10, 2, 1000);

			let buyableTickets = await ticket.getBuyableTickets();
			let soldTickets = await ticket.getSoldTickets();
			const targetTicket = buyableTickets[0];

			await ticket.connect(account1).buyTicket(targetTicket, { value: 100 });

			buyableTickets = await ticket.getBuyableTickets();
			soldTickets = await ticket.getSoldTickets();

			expect(await ticket.ownerOf(targetTicket)).to.equal(account1.address);
		});

		it("Should be able to transfer ticket to another one from ticket's owner", async function () {
			const { ticket, owner, account1, account2 } = await loadFixture(
				deployConcertTicketFixture
			);

			await ticket.genAreaTickets(2, 50, 1, 100);
			await ticket.genTickets(2, 10, 2, 1000);

			const buyableTickets = await ticket.getBuyableTickets();
			const targetTicket = buyableTickets[0];

			const account1Ticket = ticket.connect(account1);
			await account1Ticket.buyTicket(targetTicket, { value: 100 });
			await account1Ticket.transferTicketOnlyOwner(account2, targetTicket);

			expect(await ticket.ownerOf(targetTicket)).to.equal(account2.address);
		});
		it("Should be able to clean tickets", async function () {
			const { ticket, account1 } = await loadFixture(
				deployConcertTicketFixture
			);

			await ticket.genAreaTickets(2, 50, 1, 100);
			await ticket.genTickets(2, 10, 2, 1000);

			const buyableTickets = await ticket.getBuyableTickets();
			const targetTicket = buyableTickets[0];

			await ticket.connect(account1).buyTicket(targetTicket, { value: 100 });
			await ticket.cleanTickets();

			expect((await ticket.getTicketInfo(targetTicket)).expired).is.true;
			expect(await ticket.getBuyableTickets()).is.empty;
			expect(await ticket.getSoldTickets()).is.empty;
		});
	});
});
