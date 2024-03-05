import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import todo_abi from "../artifacts/contracts/Todo.sol/TODO.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [task, setTASK] = useState(undefined);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(false);
  const taskRef = useRef();

  const contractAddress = "0xE0F50FB4a4Fa753a88dB7c3a9003D97c04dF316E";
  const taskABI = todo_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getTASKContract();
  };

  const getTASKContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const taskContract = new ethers.Contract(contractAddress, taskABI, signer);

    setTASK(taskContract);
  };

  const createTask = async () => {
    if (task) {
      setStatus(true);
      let tx = await task.createTodo(taskRef.current.value);
      await tx.wait();
      setStatus(false);
      taskRef.current.value = "";
    }
  };

  const getTask = async () => {
    if (task) {
      let items = await task.getUserTodos();
      console.log(items);
      setItems(items);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button style={{ height: "50px" }} onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    return (
      <div>
        <div>
          <div
            style={{ fontSize: "24px", color: "white", marginBottom: "30px" }}
          >
            My Tasks
          </div>
          <div style={{ marginBottom: "50px" }}>
            <input
              style={{
                height: "50px",
                border: "none",
                width: "400px",
                paddingLeft: "10px",
              }}
              placeholder="Add new Task"
              ref={taskRef}
            />
            <button
              onClick={createTask}
              style={{
                height: "50px",
                border: "none",
                width: "200px",
                fontSize: "14px",
                marginLeft: "20px",
              }}
            >
              Add task
            </button>

            <div style={{ paddingTop: "20px", color: "white" }}>
              {status ? "Loading........" : ""}
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    getTask();
  }, [task, items, status]);

  return (
    <main className="container">
      <header>
        <h1
          style={{
            color: "white",
            marginTop: "0px",
            paddingTop: "50px",
            paddingBottom: "50px",
          }}
        >
          Welcome to the Metacrafters TODOs
        </h1>
      </header>
      {initUser()}
      {items.map((item) => {
        return (
          <div>
            <div style={{ fontSize: "24px", paddingBottom: "30px" }}>
              {item.name}
            </div>
          </div>
        );
      })}
      <style jsx>
        {`
          .container {
            text-align: center;
            background-color: blue;
            height: 100vh;
          }
        `}
      </style>
    </main>
  );
}
