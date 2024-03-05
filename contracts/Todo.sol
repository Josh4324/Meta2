//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
 * @author Joshua Adesanya
 * @title Todo contract
 * @notice This contract allows users to create, edit and delete their todos 
 */
contract TODO {
    // Errors
    error NotOwner();
    error AmountGreaterThanBalance();
    // Interfaces, Libraries, Contracts
    // State variables

    uint256 private id;
    mapping(uint256 => TodoItem) public addressToTodo;

    struct TodoItem {
        string name;
        bool status;
        address user;
    }
    // Events

    event TodoCreated(string name);
    event TodoEdited(string name);

    // Modifiers
    // Functions

    // External Functions

    function createTodo(string calldata name) external payable {
        addressToTodo[id] = TodoItem(name, false, msg.sender);
        id++;

        emit TodoCreated(name);
    }

    function editTodo(string calldata name, bool status, uint256 todo_id) external {
        if (msg.sender != addressToTodo[todo_id].user) {
            revert NotOwner();
        }

        addressToTodo[todo_id].name = name;
        addressToTodo[todo_id].status = status;

        emit TodoEdited(name);
    }

    function deleteTodo(uint256 todo_id) external {
        if (msg.sender != addressToTodo[todo_id].user) {
            revert NotOwner();
        }
        delete addressToTodo[todo_id];
    }

    // Public

    function getUserTodos() public view returns (TodoItem[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < id; i++) {
            if (addressToTodo[i].user == msg.sender) {
                itemCount += 1;
            }
        }

        TodoItem[] memory items = new TodoItem[](itemCount);

        for (uint256 i = 0; i < id; i++) {
            if (addressToTodo[i].user == msg.sender) {
                uint256 currentId = i;

                items[currentIndex] = addressToTodo[currentId];

                currentIndex += 1;
            }
        }

        return items;
    }
}
