const cryptoReq = async (props) => {
  const { handleChange } = props;
  await fetch("https://api.coincap.io/v2/exchanges?limit=5&rank=descending")
    .then((response) => response.json())
    .then((data) => {
      handleChange(data);
    });
};

export default cryptoReq;
