// Get the elements
const generateButton = document.getElementById("generate");
const downloadLink = document.getElementById("download");

// Hide the download link initially
downloadLink.style.display = "none";

// Add a click event listener to the generate button
generateButton.addEventListener("click", generateAndDownload);

async function generateAndDownload() {
  const { generate } = await import('./kiota-wasm/main.js');

  const specResponse = await fetch("./repair.json");
  const specString = await specResponse.text();

  // result is base64 encoded zip file
  const base64Zip = await generate(specString, "TypeScript", "MyClient", "MyNamespace");
  console.log(base64Zip);

  prepareDownload(base64Zip);
}

function prepareDownload(base64Zip) {
  const binaryString = atob(base64Zip);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);

  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }

  const blob = new Blob([bytes], { type: "application/zip" });
  const url = URL.createObjectURL(blob);

  // Show the download link and set its href and download attributes
  downloadLink.style.display = "block";
  downloadLink.href = url;
  downloadLink.download = "generated.zip";
}