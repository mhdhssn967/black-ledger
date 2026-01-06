export const buildUpiUrl = ({
  upiId,
  name,
  amount,
  note,
}) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name || "Merchant",
    am: amount,
    cu: "INR",
    tn: note || "",
  });

  return `upi://pay?${params.toString()}`;
};
