const getAccounts = async (req, res) => {
  return res.status(200).json([]);
};

const connectAccount = async (req, res) => {
  return res.status(501).json({ message: "Account connection not implemented yet" });
};

module.exports = { getAccounts, connectAccount };
