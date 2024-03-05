const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
//const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, user3, user4, user5] =
      await ethers.getSigners();

    const Todo = await ethers.getContractFactory("TODO");

    const todo = await Todo.deploy();

    return { todo, owner, user1, user2, user3, user4, user5 };
  }

  describe("Test", function () {
    it("Test 1", async function () {
      const { todo, user1, user2, user3, user4, owner } = await loadFixture(
        deploy
      );

      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      await todo.createTodo("name");
      await todo.editTodo("name", true, 0);
      console.log(await todo.getUserTodos());
      //console.log(owner.address);
    });
  });
});
