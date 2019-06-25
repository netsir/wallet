import solc from "solc";

export default code => {
  return solc.compile(
    JSON.stringify({
      language: "Solidity",
      sources: {
        "test.sol": {
          content: code
        }
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"]
          }
        }
      }
    })
  );
};
