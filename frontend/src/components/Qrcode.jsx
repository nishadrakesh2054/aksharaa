import React from "react";
import { useQrCode } from "../api/hooks/useForms";

const Qrcode = () => {
  const { data: qrCode = "" } = useQrCode();

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: qrCode }} />
      <p>Scan the QR code to download the notice PDF.</p>
    </div>
  );
};

export default Qrcode;
