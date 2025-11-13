function convertUint8ToHexString(uint8: Uint8Array) {
  return (
    "0x" +
    Array.from(uint8)
      .map((byte) => byte.toString(16).padStart(2, "0")) // Convert each byte to hex and pad with '0' if needed
      .join("")
  );
}

export default convertUint8ToHexString;
