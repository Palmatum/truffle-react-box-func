import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import { useState, useEffect } from "react";

import "./App.css";

const App = () => {
  const [state, setState] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    check: false,
  });

  useEffect(() => {
    
    getWeb3().then((web3) => {
      setState((prev) => ({...prev, web3}));
      web3.eth.getAccounts().then((accounts) => {
        setState((prev) => ({...prev, accounts}));
      })
      web3.eth.net.getId().then((networkId) => {
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          SimpleStorageContract.networks[networkId] && SimpleStorageContract.networks[networkId].address
        )
        setState((prev) => ({...prev, contract: instance}));
      }).then(() => {
        setState((prev) => ({...prev, check: true}))
      })
    }).catch((error) => {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }).then(() => {
        runExample()
    })
    
  }, [])

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // Get network provider and web3 instance.
  //       const web3 = await getWeb3();
  //       console.log(web3);

  //       // Use web3 to get the user's accounts.
  //       const accounts = await web3.eth.getAccounts();

  //       // Get the contract instance.
  //       const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = SimpleStorageContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         SimpleStorageContract.abi,
  //         deployedNetwork && deployedNetwork.address
  //       );

  //       setState((prev) => ({
  //         ...prev,
  //         web3,
  //         accounts,
  //         contract: instance,
  //         check: true,
  //       }));
  //     } catch (e) {
  //       alert(
  //         `Failed to load web3, accounts, or contract. Check console for details.`
  //       );
  //       console.log(e);
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (state.check) {
  //     runExample();
  //   }
  // }, [state.check]);

  const runExample = async () => {
    const _accounts = state.accounts;
    const _contract = state.contract;
    console.log(state);
    // Stores a given value, 5 by default.
    await _contract.methods.set(5).send({ from: _accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await _contract.methods.get().call();

    // Update state with the result.
    setState((prev) => ({ ...prev, storageValue: response }));
  };

  return state.web3 ? (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show a
        stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 42</strong> of App.js.
      </p>
      <div>The stored value is: {state.storageValue}</div>
    </div>
  ) : (
    <div>Loading Web3, accounts, and contract...</div>
  );
};

// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );

//       instance.options.address = '0x003D75f76801D739b99434d4C4813c57B27D18E0'

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.runExample);

//       console.log(this.state)
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>Good to Go!</h1>
//         <p>Your Truffle Box is installed and ready.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 42</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }

export default App;
